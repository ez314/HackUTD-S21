import discord
import json
from discord.ext import commands
import re
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import urllib.parse

# set up intents
intents = discord.Intents.all()


# instantiate config & bot
botconfig = json.load(open('config.json', 'r'))
bot = commands.Bot(command_prefix='.', case_insensitive=True, intents=intents)

# initialize firebase
cred = credentials.Certificate("firebase_admin.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

reactionChannel = None
regional_indicators = ['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿']

def dictToUrl(d):
    return f'http://x.co?{urllib.parse.quote_plus(json.dumps(d))}'

def urlToDict(u):
    return json.loads(urllib.parse.unquote_plus(u[12:]))


@bot.event
async def on_ready():
    global reactionChannel
    print(f'Logged in as {bot.user}!')
    # resolve reaction channel
    reactionChannel = await bot.fetch_channel(botconfig['reactionChannelID'])


@bot.command(name='faq')
async def faq(ctx, action='unknown'):
    # validators for wizard
    def validate_msg(m):
        return m.content and m.channel == ctx.channel and m.author == ctx.author
    def validate_url(m):
        return validate_msg(m) and re.match(r'https://(canary.)?discord.com/channels/\d{17,20}/\d{17,20}/\d{17,20}', m.content)

    category = ctx.channel.category

    # validate the category and extract faq channel
    if not category:
        await ctx.send('This command doesn\'t work here!')
        return
    else:
        faqChannels = [x for x in category.channels if x.name == 'faq']
        if not faqChannels:
            await ctx.send('This command doesn\'t work here!')
            return
        faqChannel = faqChannels[0]

    # behavior changes based on action
    if action == 'add':
        preview = discord.Embed(
            title='<Question>',
            description='<Answer>',
            color=discord.Color.random(),
        )
        preview.set_author(name=ctx.author.name, icon_url=ctx.author.avatar_url)

        previewMsg = await ctx.send(embed=preview)

        # get question
        queryMsg = await ctx.send("What is the question?")
        questionMsg = await bot.wait_for('message', check=validate_msg)
        question = questionMsg.content
        await questionMsg.delete()

        preview.title = question
        await previewMsg.edit(embed=preview)

        # get answer
        await queryMsg.edit(content="What is the answer?")
        answerMsg = await bot.wait_for('message', check=validate_msg)
        answer = answerMsg.content
        await answerMsg.delete()

        preview.description = answer
        await previewMsg.edit(embed=preview)

        # get mesage link
        await queryMsg.edit(content="What is the message link to the original question?")
        linkMsg = await bot.wait_for('message', check=validate_url)
        link = linkMsg.content
        await linkMsg.delete()

        preview.description += f'\n[Jump to context]({link})'
        await previewMsg.edit(embed=preview)
        
        # store in firestore
        db.collection('faq').document(str(category.id)).collection('faqs').add({
            u'question': question,
            u'answer': answer,
            u'link': link,
            u'author': {
                'name': ctx.author.name, 
                'icon_url': str(ctx.author.avatar_url)
            },
            u'timestamp': firestore.SERVER_TIMESTAMP
        })

        # TODO: Send the embed in FAQ channel
        await faqChannel.send(embed=preview)

        await queryMsg.edit(content=f"Question \"{question}\" stored successfully.")
    elif action == 'show':
        ref = db.collection('faq').document(str(category.id)).collection('faqs')
        docs = ref.order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
        result = discord.Embed(
            title=f'FAQs for {category.name}'
        )
        for doc in docs:
            info = doc.to_dict()
            result.add_field(
                name=info['question'], 
                value=f"{info['answer']}\n[Jump to context]({info['link']})",
                inline=False
            )  
        if result.fields:
            await ctx.send(embed=result)
        else:
            await ctx.send("No FAQ entries found.")

    elif action == 'remove':
        ref = db.collection('faq').document(str(category.id)).collection('faqs')

        await ctx.send("What was the question?")
        question = await bot.wait_for('message', check=validate_msg)
        question = question.content

        matches = ref.where('question', '==', question).get()
        if not matches:
            await ctx.send(f"No question with title \"{question}\" was found.")
            return

        match = matches[0]
        info = match.to_dict()
        preview = discord.Embed(
            title=info['question'],
            description=f"{info['answer']}\n[Jump to context]({info['link']})",
        )
        preview.set_author(name=info['author']['name'], icon_url=info['author']['icon_url'])

        await ctx.send("Is this the correct question? (yes/no) \n\n", embed=preview)

        confirm = await bot.wait_for('message', check=validate_msg)
        print(confirm)
        if confirm.content.lower() == 'yes':
            ref.document(match.id).delete()
            await ctx.send(f"Question with title \"{question}\" successfully deleted")
        else:
            await ctx.send("Operation cancelled.")
    else:
        await ctx.send('Usage: `.faq add`, `.faq remove`, or `.faq show`')

@bot.command(name='create')
async def create(ctx, name, moderator):
    global reactionChannel
    guild = ctx.guild

    # make sure this doesn't exist yet
    docs = db.collection('faq').where('name', '==', name).get()
    if docs:
        await ctx.send("That name is taken.")
        return
    
    # resolve ping
    match = re.match(r'<@!?(\d{17,20})>', moderator)
    if match:
        modID = int(match.groups()[0])
        mod = guild.get_member(modID)
    # resolve ID
    else:
        match = re.match(r'\d{17,20}', moderator )
        if match:
            modID = int(moderator)
            mod = guild.get_member(modID)
        # resolve by name
        else:
            mod = guild.get_member_named(moderator)

    if not mod:
        return await ctx.send(f'Could not find someone named {moderator}')
    
    # create a role with the name
    role = await guild.create_role(name=name)
    await mod.add_roles(role)
    
    # create a category
    category = await guild.create_category(name)
    # set perms
    await category.set_permissions(role, view_channel=True)
    await category.set_permissions(guild.default_role, view_channel=False)
    await category.set_permissions(mod, manage_channels=True, manage_messages=True)

    # create txt channels
    await category.create_text_channel('discussion')
    faqChannel = await category.create_text_channel('faq')
    faqPerms = faqChannel.overwrites_for(role)
    faqPerms.send_messages = False
    await faqChannel.set_permissions(role, overwrite=faqPerms)
    await category.create_voice_channel('Study Room 1')
    await category.create_voice_channel('Study Room 2')

    # add results to firestore
    db.collection('faq').document(str(category.id)).set({
        'name': name,
        'moderator': mod.id,
        'role': role.id,
        'category': {
            'id': category.id,
            'name': category.name
        },
        'faqID': faqChannel.id,
    })

    # Register reaction role
    # first, we need to get the message
    
    reactionMsg = None
    async for message in reactionChannel.history(limit=10):
        if message.author == bot.user and message.embeds:
            if len(message.reactions) < 20:
                reactionMsg = message
            break

    if reactionMsg:
        em = reactionMsg.embeds[0]

        data = urlToDict(em.description.splitlines()[0][4:-1])
        last = max(list(map(int, data.keys())))

        reaction = regional_indicators[last+1]

        data[last+1] = role.id
        em.description = (
                f"[\u200B]({dictToUrl(data)})\n" + 
                '\n'.join(em.description.splitlines()[1:]) + 
                f'\n{reaction} {name}'
        )

        await reactionMsg.edit(embed=em)
        await reactionMsg.add_reaction(reaction)

    # initialize new reaction mesage if none exists right now or previous one is full
    else:
        reaction = regional_indicators[0]
        reactionMsg = await reactionChannel.send(embed=discord.Embed(
            title='React to gain access to a class category',
            description=f"[\u200B]({dictToUrl({0: role.id})})\n" + f'{reaction} {name}'
        ))
        await reactionMsg.add_reaction(reaction)

    await ctx.send('Done')
    
@bot.command(name='send')
async def create(ctx, channel):
    channel = int(re.match(r'<#(\d*)>', channel).groups()[0])
    chan = bot.get_channel(channel)

    jsonStr = re.match(r'.*?(\{.*\}).*?', ctx.message.content, re.DOTALL).groups()[0]

    await chan.send(embed=discord.Embed.from_dict(json.loads(jsonStr)))
    
# reaction roles

# add roles
@bot.event
async def on_raw_reaction_add(payload):
    # ignore other channels and self
    if payload.channel_id != botconfig['reactionChannelID'] or payload.user_id == bot.user.id:
        return

    # fetch
    reactionMsg = await reactionChannel.fetch_message(payload.message_id)

    # resolve emoji
    reaction = payload.emoji.name
    idx = regional_indicators.index(reaction)

    # resolve role
    em = reactionMsg.embeds[0]
    data = urlToDict(em.description.splitlines()[0][4:-1])
    roleId = data[str(idx)]
    role = reactionMsg.guild.get_role(roleId)

    # resolve user
    member = reactionMsg.guild.get_member(payload.user_id)

    await member.add_roles(role)

# remove roles
@bot.event
async def on_raw_reaction_remove(payload):
    # ignore other channels and self
    if payload.channel_id != botconfig['reactionChannelID'] or payload.user_id == bot.user.id:
        return

    # fetch
    reactionMsg = await reactionChannel.fetch_message(payload.message_id)

    # resolve emoji
    reaction = payload.emoji.name
    idx = regional_indicators.index(reaction)

    # resolve role
    em = reactionMsg.embeds[0]
    data = urlToDict(em.description.splitlines()[0][4:-1])
    roleId = data[str(idx)]
    role = reactionMsg.guild.get_role(roleId)

    # resolve user
    member = reactionMsg.guild.get_member(payload.user_id)

    await member.remove_roles(role)

# Start the bot
bot.run(botconfig['token'], bot=True)

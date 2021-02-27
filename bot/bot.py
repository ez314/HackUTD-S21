import discord
import json
from discord.ext import commands
import re
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# set up intents
intents = discord.Intents.all()


# instantiate config & bot
botconfig = json.load(open('config.json', 'r'))
bot = commands.Bot(command_prefix='eric.', case_insensitive=True, intents=intents)

# initialize firebase
cred = credentials.Certificate("firebase_admin.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}!')


@bot.command(name='faq')
async def faq(ctx, channel):
    channel = int(re.match(r'<#(\d*)>', channel).groups()[0])
    chan: discord.TextChannel = bot.get_channel(channel)
    category = ctx.channel.category

    # validate the category
    if not category:
        await ctx.send('This command doesn\'t work here!')
        return


    # make sure the message is not empty and is in the same channel
    def validate_msg(m):
        return m.content and m.channel == ctx.channel and m.author == ctx.author
    def validate_url(m):
        return validate_msg(m) and re.match(r'https://(canary.)?discord.com/channels/\d{17,20}/\d{17,20}/\d{17,20}', m.content)


    preview = discord.Embed(
        title = '<Question>',
        description = '<Answer>',
        color = discord.Color.random(),
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
    doc_ref = db.collection('faq').document(question)
    doc_ref.set({
        u'question': question,
        u'answer': answer,
        u'link': link,
        u'timestamp': firestore.SERVER_TIMESTAMP
    })

    # TODO: Send the embed in FAQ channel

    await queryMsg.edit(content=f"Question \"{question}\" stored successfully.")


@bot.command(name='show')
async def show_faq(ctx, channel):
    channel = int(re.match(r'<#(\d*)>', channel).groups()[0])
    chan: discord.TextChannel = bot.get_channel(channel)

    ref = db.collection(u'faq')
    docs = ref.where('channel', '==', str(chan.id)).order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
    result = ""
    for doc in docs:
        info = doc.to_dict()
        print(info)
        result += f"Question: {info['question']} \nAnswer: {info['answer']} \nLink: {info['link']} \n\n"
    
    if result:
        await ctx.send(result)
    else:
        await ctx.send("No FAQ entries found.")


@bot.command(name='delete')
async def delete_faq(ctx, channel):
    channel = int(re.match(r'<#(\d*)>', channel).groups()[0])
    chan: discord.TextChannel = bot.get_channel(channel)

    # make sure the message is not empty and is in the same channel
    def not_empty(m):
        return len(m.content) > 0 and m.channel == chan and m.author != bot.user

    faqs = db.collection(u'faq')

    await chan.send("What was the message question?")
    question = await bot.wait_for('message', check=not_empty)
    question = question.content

    matches = faqs.where(u'question', u'==', question).get()
    if not matches or len(matches) == 0:
        await chan.send(f"No question with title \"{question}\" was found.")
        return

    match = matches[0]
    info = match.to_dict()
    questions = f"Question: {info['question']} \nAnswer: {info['answer']} \nLink: {info['link']} \n\n"

    await chan.send("Is this the correct question? (yes/no) \n\n" + questions)

    confirm = await bot.wait_for('message', check=not_empty)
    print(confirm)
    if confirm.content.lower() == 'yes':
        faqs.document(question).delete()
        await chan.send(f"Question with title \"{question}\" successfully deleted")
    else:
        await chan.send("Operation cancelled.")


@bot.command(name='send')
async def send(ctx, channel, message):
    channel = int(re.match(r'<#(\d*)>', channel).groups()[0])
    chan: discord.TextChannel = bot.get_channel(channel)
    msg = message
    print(channel, msg)
    await chan.send(msg)

@bot.command(name='create')
async def create(ctx, name, moderator):
    guild = ctx.guild

    # make sure this doesn't exist yet
    docs = db.collection('faq').where('name', '==', name).get()
    if docs:
        await ctx.send("That name is taken.")
        return


    print(moderator)
    
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
    faqChannel = await guild.create_text_channel('faq')
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

    # TODO: register reaction role

    await ctx.send('Done')
# Start the bot
bot.run(botconfig['token'], bot=True)

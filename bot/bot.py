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

    # make sure the message is not empty and is in the same channel
    def not_empty(m):
        return len(m.content) > 0 and m.channel == chan and m.author != bot.user

    # get question
    await chan.send("What is the question?")
    question = await bot.wait_for('message', check=not_empty)
    question = question.content

    # get answer
    await chan.send("What is the answer?")
    answer = await bot.wait_for('message', check=not_empty)
    answer = answer.content

    # get mesage link
    await chan.send("What was the message link to the original question?")
    link = await bot.wait_for('message', check=not_empty)
    link = link.content

    # store in firestore
    doc_ref = db.collection(u'faq').document(question)
    doc_ref.set({
        u'question': question,
        u'answer': answer,
        u'link': link
    })

    await chan.send(f"Question \"{question}\" stored successfully.")


@bot.command(name='show')
async def show_faq(ctx, channel):
    channel = int(re.match(r'<#(\d*)>', channel).groups()[0])
    chan: discord.TextChannel = bot.get_channel(channel)

    users_ref = db.collection(u'faq')
    docs = users_ref.stream()
    result = ""
    for doc in docs:
        info = doc.to_dict()
        print(info)
        result += f"Question: {info['question']} \nAnswer: {info['answer']} \nLink: {info['link']} \n\n"
    print(result)
    await chan.send(result)


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
    # TODO: Make sure name isn't taken in firestore
    # first resolve the moderator to a member

    print(moderator)
    
    # resolve ping
    match = re.match(r'<@!?(\d{17,20})>', moderator)
    if match:
        print(1)
        modID = int(match.groups()[0])
        print(modID)
        print([x.id for x in guild.members])
        mod = guild.get_member(modID)
    # resolve ID
    else:
        match = re.match(r'\d{17,20}', moderator )
        if match:
            print(2)
            modID = int(moderator)
            mod = guild.get_member(modID)
        # resolve by name
        else:
            print(3)
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
    await guild.create_text_channel('discussion', category=category)
    faqChannel = await guild.create_text_channel('faq', category=category)
    await faqChannel.set_permissions(role, send_messages=False)
    await guild.create_voice_channel('Study Room 1', category=category)
    await guild.create_voice_channel('Study Room 2', category=category)
    


    # TODO: add results to firestore

    await ctx.send('Done')
    
    
# reaction roles

# add roles
@bot.event
async def on_raw_reaction_add(payload):
    message_id = payload.message_id

    # message id of discord message
    if message_id == 815329016973754369:
        guild_id = payload.guild_id
        guild = discord.utils.find(lambda g: g.id == guild_id, bot.guilds)
        print('Reacted to text')

        # role selection
        if payload.emoji.name == 'CS1336':
            role = discord.utils.get(guild.roles, name='CS 1336')
        
        elif payload.emoji.name == 'CS2336':
            role = discord.utils.get(guild.roles, name='CS 2336')
        
        # role assignment
        if role is not None:
            member = discord.utils.find(lambda m: m.id == payload.user_id, guild.members)

            if member is not None:
                await member.add_roles(role)
                print('done')
            
            else:
                print('Member not found.')
        
        else:
            print('Role not found.')


# remove roles
@bot.event
async def on_raw_reaction_remove(payload):
    message_id = payload.message_id

    # message id of discord message
    if message_id == 815329016973754369:
        guild_id = payload.guild_id
        guild = discord.utils.find(lambda g: g.id == guild_id, bot.guilds)
        print('Reacted to text')

        # role selection
        if payload.emoji.name == 'CS1336':
            role = discord.utils.get(guild.roles, name='CS 1336')
        
        elif payload.emoji.name == 'CS2336':
            role = discord.utils.get(guild.roles, name='CS 2336')

        elif payload.emoji.name == 'prof1':
            role = discord.utils.get(guild.roles, name='Professor 1')

        elif payload.emoji.name == 'prof2':
            role = discord.utils.get(guild.roles, name='Professor 2')
        
        
        # role assignment
        if role is not None:
            member = discord.utils.find(lambda m: m.id == payload.user_id, guild.members)

            if member is not None:
                await member.remove_roles(role)
                print('Removed')
            
            else:
                print('Member not found.')
        
        else:
            print('Role not found.')

# Start the bot
bot.run(botconfig['token'], bot=True)

import discord
import json
from discord.ext import commands
import re
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# instantiate config & bot
botconfig = json.load(open('config.json', 'r'))
bot = commands.Bot(command_prefix='.', case_insensitive=True)

# initialize firebase
cred = credentials.Certificate("firebase_admin.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


@bot.event
async def on_ready():
    print('Logged in as {}!'.format(bot.user))


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

# Start the bot
bot.run(botconfig['token'], bot=True)

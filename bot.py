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
        return len(m.content) > 0 and m.channel == chan

    # get question
    await chan.send("What is the question?")
    question = await bot.wait_for('message', check=not_empty)
    question = question.content

    # get answer
    await chan.send("What is the answer?")
    answer = await bot.wait_for('message', check=not_empty)
    answer = answer.content

    # store in firestore
    doc_ref = db.collection(u'faq').document(question)
    doc_ref.set({
        u'question': question,
        u'answer': answer
    })

    await chan.send(f"Question \"{question}\" stored successfully.") 

@bot.command(name='send')
async def send(ctx, channel, message):
    channel = int(re.match(r'<#(\d*)>', channel).groups()[0])
    chan: discord.TextChannel = bot.get_channel(channel)
    msg = message
    print(channel, msg)
    await chan.send(msg)

# Start the bot
bot.run(botconfig['token'], bot=True)

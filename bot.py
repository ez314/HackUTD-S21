import discord
import json
from discord.ext import commands
import re

# instantiate config & bot
botconfig = json.load(open('config.json', 'r'))
bot = commands.Bot(command_prefix='.', case_insensitive=True)

@bot.event
async def on_ready():
    print('Logged in as {}!'.format(bot.user))

@bot.command(name='send')
async def send(ctx, channel, message):
    channel = int(re.match(r'<#(\d*)>', channel).groups()[0])
    chan: discord.TextChannel = bot.get_channel(channel)
    msg = message
    print(channel, msg)
    await chan.send(msg)

# Start the bot
bot.run(botconfig['token'], bot=True)

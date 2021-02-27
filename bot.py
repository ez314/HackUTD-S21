import discord
import json
from discord.ext import commands
import re

# set up intents
intents = discord.Intents.all()


# instantiate config & bot
botconfig = json.load(open('config.json', 'r'))
bot = commands.Bot(command_prefix='eric.', case_insensitive=True, intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}!')

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
# Start the bot
bot.run(botconfig['token'], bot=True)

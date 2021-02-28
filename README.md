# Solace | HackUTD VII (Spring 2021)
Solace promotes collaboration among students at a time when we need it the most, with crowdsourced FAQs, real-time announcements and reminders, and a beautiful web dashboard.

https://devpost.com/software/solace-pmgian

## Inspiration

As students, we were frustrated with Blackboard—although it is a powerful system, a lot of features are unintuitive, clunky, and hard to navigate. 

We also found the current status quo for class collaboration to be unreasonably complicated: having to keep track of 3 GroupMe's and 2 Discord servers is difficult, time-consuming, and unorganized.

Finally, we found that Discord had a clean interface with excellent organization capabilities, permissions management, and ease of use. So we built Solace around Discord.

## What it does

At its core, Solace has a Discord bot that transforms any server into a collaboration space for students. The space is split into categories for each class, and students can join classes with a single click. These features are common among other bots, but Solace's other capabilities set it apart from every other service.

### Solace remembers.
We don't think fast-paced group chats should make students ask the same questions again and again. With the "FAQ" command suite, students can use Solace to remember important facts and the answers to common questions.

### Solace relays.
Blackboard's system for class announcements is functional, whereas Discord's is quite robust. For example, Blackboard doesn't have a well-designed "unread" and "read" functionality. To remedy this, Solace reads announcements from Blackboard and automatically copies them to Discord channels for the appropriate class. 

### Solace reminds.
The online setting makes it harder than ever to stay on top of assignments and deadlines. Solace reminds the group chat of approaching deadlines for events on the rarely-used Blackboard calendar.  

### Web Dashboard
On top of all of these features, Solace also has a powerful web dashboard. Users simply need to log in with their Discord account, and they will have access to all FAQs and deadlines for their classes.  

## How we built it

### Discord

We used the popular [discord.py](http://discord.py) library to create a Discord bot for students. This bot calls the Discord API to create channels and assign appropriate permissions. All data (classes, FAQs, etc.) is stored and synced in Cloud Firestore. 

A unique part of Solace is that it delegates one user to act as the moderator for each class. This prevents the need for extensive moderation teams, and it gives students a moderator who's in the same boat as they are.

### Dashboard

The dashboard is built with Next.js and TailwindCSS to provide a simple and intuitive collection of a user's course FAQs. Various API routes exist for authentication purposes (retrieve token and callback), as well as for interfacing with Cloud Firestore from the front-end to retrieve FAQ and user information. Discord OAuth is used to retrieve the user's unique ID, which is then used to communicate with Cloud Firestore in order to retrieve FAQs. Tailwind allows us to easily style components and create a cohesive theme across the platform. 

This dashboard is available at [https://solace-colab.space](https://solace-colab.space), a domain name we acquired through Domain.com. It's hosted on Vercel, and the DNS is managed by CloudFlare. 

## Challenges we ran into

### Deploying Next.js application to Vercel  
Although Vercel is very easy to configure, a lot of issues came up when we tried to deploy the application with Firestore Admin configurations. Some of the issues were due to environment variables, but the main obstacle was not realizing that our dependency file was corrupted due to a merge request. After unsuccessfully deploying to Netlify and Heroku, we finally realized the issue while deploying to Vercel.

### Discord OAuth flow  
Since we wanted to make a web application that is fully integrated with the Cloud Firestore database, logging in through Discord would provide a seamless experience for the users as they do not need to directly provide their user IDs to be identified. However, Discord's OAuth is not well documented with Next.js. We had to figure out how to handle everything from the initial login token authorization, to redirecting to a callback function which verifies and stores an access token, and finally using the access token to communicate with the database. Once it was set up, though, it provided a very smooth authorization process for the end user, which is one of our main goals.

## Accomplishments that we're proud of

### Ease of use for the end user

Throughout the development process, we repeatedly improved upon our project to deliver the best possible end-user experiences. All our discord bot commands have extensive error handling, and they are capable of guiding users through the command in case of incorrect usage.

### Front end application

We realize that Discord isn't always the best place to view a large amount of information. So we developed an entire front-end application that connects directly with Discord. This was all of our first times designing full web pages, so we're proud of what we came up with.

## What's next for Solace

### Connecting to Blackboard
We plan on connecting to Blackboard to retrieve more useful information for both students and professors in the future.  Blackboard provides access to information such as upcoming assignments and course announcements, which would enhance the collaborative experience for students as they can transition smoothly between our platform and Blackboard.

### Mobile view or mobile app
To optimize convenience for our users, a well-made mobile interface is necessary. So, this is one of our top priority next steps.

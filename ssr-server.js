const express = require("express");
const fetch = require("node-fetch");
const btoa = require("btoa");
const { catchAsync } = require("./utils");
const next = require("next");
const FormData = require('form-data');
require('dotenv').config();


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(require('express-session')({
        "secret": "youshallnotpass",
        "cookie": {
            "maxAge": 86400000
        },
        "resave": true,
        "saveUninitialized": false
    }))


    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const redirect = encodeURIComponent(
      "http://localhost:3000/login/callback"
    );

    server.get('/login', (req, res) => {
        // Redirecting to login url
        res.redirect(`https://discord.com/api/oauth2/authorize` +
                     `?client_id=${CLIENT_ID}` +
                     `&redirect_uri=${redirect}` +
                     `&response_type=code&scope=identify`)
    });

    server.get('/login/callback', async (req, resp) => {
        const accessCode = req.query.code;
        if (!accessCode) // If something went wrong and access code wasn't given
            return resp.send('No access code specified');
    
        // Creating form to make request
        const data = new FormData();
        data.append('client_id', CLIENT_ID);
        data.append('client_secret', CLIENT_SECRET);
        data.append('grant_type', 'authorization_code');
        data.append('redirect_uri', "http://localhost:3000/login/callback");
        data.append('scope', 'identify');
        data.append('code', accessCode);
    
        // Making request to oauth2/token to get the Bearer token
        const json = await (await fetch('https://discord.com/api/oauth2/token', {method: 'POST', body: data})).json();
        req.session.bearer_token = json.access_token;
        console.log(json);
    
        resp.redirect('/page'); // Redirecting to main page
    });

    server.get('/page', async (req, resp) => {
        if(!req.session.bearer_token)
            return resp.redirect('/login') // Redirect to login page
        
        const data = await fetch(`https://discord.com/api/users/@me`, {headers: { Authorization: `Bearer ${req.session.bearer_token}` } }); // Fetching user data
        const json = await data.json();
    
        if(!json.username) // This can happen if the Bearer token has expired or user has not given permission "indentity"
            return resp.redirect('/login') // Redirect to login page
    
        resp.send(`<h1>Hello, ${json.username}#${json.discriminator}!</h1>` +
                  `<img src="https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=512">`) // Show user's nametag and avatar
    })


    //
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });

    server.use((err, req, res, next) => {
      switch (err.message) {
        case "NoCodeProvided":
          return res.status(400).send({
            status: "ERROR",
            error: err.message,
          });
        default:
          return res.status(500).send({
            status: "ERROR",
            error: err.message,
          });
      }
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

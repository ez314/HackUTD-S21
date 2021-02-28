require("dotenv").config();
const FormData = require('form-data');
import nookies from 'nookies'
import { serialize } from 'cookie';

const dev = process.env.NODE_ENV !== "production";
let redirect = "http://localhost:3000/api/callback";
if (!dev) {
    redirect = ""; // SET DEPLOYED ENDPOINT TODO
}

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

export default async function handler(req, res) {
  const accessCode = req.query.code;
  if (!accessCode)
    // If something went wrong and access code wasn't given
    return resp.send("No access code specified");

  // Creating form to make request
  const data = new FormData();
  data.append("client_id", CLIENT_ID);
  data.append("client_secret", CLIENT_SECRET);
  data.append("grant_type", "authorization_code");
  data.append("redirect_uri", redirect);
  data.append("scope", "identify");
  data.append("code", accessCode);

  // Making request to oauth2/token to get the Bearer token
  const json = await (
    await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: data,
    })
  ).json();
  res.setHeader('Set-Cookie', serialize('token', json.access_token, { path: '/' }));
  res.redirect("/"); // Redirecting to main page
}

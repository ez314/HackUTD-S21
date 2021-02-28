require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
import URL from '../../lib/url';

const dev = process.env.NODE_ENV !== "production";
let redirect_url = `${URL}/api/callback`;

const redirect = encodeURIComponent(redirect_url);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        res.redirect(`https://discord.com/api/oauth2/authorize` +
        `?client_id=${CLIENT_ID}` +
        `&redirect_uri=${redirect}` +
        `&response_type=code&scope=identify`) 
    }
}
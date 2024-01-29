// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const clientId = 'egxcai0act4gxendn45lv6faqcvwhi';
const clientSecret = '8c5iuv43t50au8n17didvt6kv9zyvq';
const redirectUri = 'http://localhost:5173/auth/twitch/callback';

// Redirect to Twitch authorization endpoint
app.get('/auth/twitch', (req, res) => {
  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user_read`;
  res.redirect(twitchAuthUrl);
});

// Handle Twitch callback
app.get('/auth/twitch/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange code for access token
  const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Use the access token to make authenticated requests to Twitch API
  // Handle the response accordingly
  
  res.send('Authenticated successfully!');
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

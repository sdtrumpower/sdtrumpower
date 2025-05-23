const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const querystring = require('querystring');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// OAuth2 Redirect endpoint
app.get('/oauth', async (req, res) => {
    const code = req.query.code;
    
    // Exchange authorization code for access token
    const tokenUrl = 'https://account-d.docusign.com/oauth/token';
    const body = querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI,
    });

    try {
        const response = await axios.post(tokenUrl, body, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        // Store token in session or database, then redirect to launch envelope
        res.json(response.data);
    } catch (err) {
        console.error('Error exchanging code for token:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

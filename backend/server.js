import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.MAILCHIMP_API_KEY;
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const DATACENTER = API_KEY.split('-')[1]; // Например, 'us21'

app.post('/subscribe', async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `apikey ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
      merge_fields: { FNAME: name },
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.status >= 400) {
      return res.status(response.status).json({ error: data.detail });
    }

    return res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

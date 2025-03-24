const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Subscriber Schema
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Route to Add Subscriber
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Send Confirmation Email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const confirmationUrl = `http://localhost:5000/confirm/${newSubscriber._id}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirm Your Subscription',
      html: `<p>Click <a href="${confirmationUrl}">here</a> to confirm your subscription.</p>`,
    });

    res.status(200).json({ message: 'Subscription successful. Please check your email to confirm.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to Confirm Subscription
app.get('/confirm/:id', async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) return res.status(404).send('Subscriber not found.');

    subscriber.confirmed = true;
    await subscriber.save();
    res.status(200).send('Subscription confirmed!');
  } catch (error) {
    res.status(500).send('Error confirming subscription.');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

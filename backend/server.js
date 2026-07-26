const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Models
const Inquiry = require('./models/Inquiry');
const Newsletter = require('./models/Newsletter');
const Booking = require('./models/Booking');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/joylo';
mongoose
  .connect(dbUri)
  .then(() => console.log(`MongoDB connected successfully at: ${dbUri}`))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Joylo backend is up and running.' });
});

// 1. Submit contact inquiry or quote request
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, destination, duration, service, message, formType } = req.body;

    if (!name || !email || !formType) {
      return res.status(400).json({ error: 'Name, email, and formType are required.' });
    }

    const newInquiry = new Inquiry({
      name,
      email,
      destination,
      duration,
      service,
      message,
      formType
    });

    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully!', data: newInquiry });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry. Please try again later.' });
  }
});

// 2. Submit newsletter subscription
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'This email is already subscribed to our newsletter.' });
    }

    const newSubscription = new Newsletter({ email });
    await newSubscription.save();

    res.status(201).json({ message: 'Subscribed successfully!', data: newSubscription });
  } catch (error) {
    console.error('Error saving newsletter subscription:', error);
    res.status(500).json({ error: 'Failed to subscribe. Please try again later.' });
  }
});

// 3. Submit specific destination trip booking inquiry
app.post('/api/bookings', async (req, res) => {
  try {
    const { tripName, fullName, phone, email, sharingPreference, travelDate } = req.body;

    if (!tripName || !fullName || !phone || !email || !travelDate) {
      return res.status(400).json({ error: 'All fields (tripName, fullName, phone, email, travelDate) are required.' });
    }

    const newBooking = new Booking({
      tripName,
      fullName,
      phone,
      email,
      sharingPreference,
      travelDate: new Date(travelDate)
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking inquiry submitted successfully!', data: newBooking });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to submit booking request. Please try again later.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

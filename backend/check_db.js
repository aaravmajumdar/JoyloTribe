const mongoose = require('mongoose');

// Import Schemas
const Inquiry = require('./models/Inquiry');
const Newsletter = require('./models/Newsletter');
const Booking = require('./models/Booking');

const dbUri = 'mongodb://127.0.0.1:27017/joylo';

async function run() {
  await mongoose.connect(dbUri);
  console.log('--- Connected to local MongoDB ---');

  const inquiries = await Inquiry.find({});
  const newsletters = await Newsletter.find({});
  const bookings = await Booking.find({});

  console.log(`\nFound ${inquiries.length} Inquiries:`);
  console.log(JSON.stringify(inquiries, null, 2));

  console.log(`\nFound ${newsletters.length} Newsletter Subscriptions:`);
  console.log(JSON.stringify(newsletters, null, 2));

  console.log(`\nFound ${bookings.length} Bookings:`);
  console.log(JSON.stringify(bookings, null, 2));

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB.');
}

run().catch(console.error);

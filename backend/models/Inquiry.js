const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  destination: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  service: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  formType: {
    type: String,
    required: true,
    enum: ['inquiry', 'quote']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inquiry', InquirySchema);

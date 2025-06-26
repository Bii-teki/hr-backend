const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  qualifications: {
    type: [String],
    required: true,
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
  },
  currentPosition: {
    type: String,
  },
  currentCompany: {
    type: String,
  },
  jobPreferences: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offered', 'Hired', 'Rejected'],
    default: 'Applied',
  },
  interviewDate: {
    type: Date,
  },
  feedback: {
    type: String,
  },
  resume: {
    type: String, // URL to resume file
  },
  appliedJob: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Candidate', CandidateSchema);
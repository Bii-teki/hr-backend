const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const asyncHandler = require('express-async-handler');
const { generateAttentionCards } = require('../utils/attentionCards');

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private/HR
const getCandidates = asyncHandler(async (req, res) => {
  const candidates = await Candidate.find().populate('appliedJob');
  
  // Generate attention cards
  const attentionCards = generateAttentionCards(candidates);
  
  res.status(200).json({
    success: true,
    count: candidates.length,
    data: candidates,
    attentionCards,
  });
});

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private/HR
const getCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id).populate('appliedJob');

  if (!candidate) {
    res.status(404);
    throw new Error('Candidate not found');
  }

  res.status(200).json({
    success: true,
    data: candidate,
  });
});

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Private/HR
const createCandidate = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    qualifications,
    experience,
    currentPosition,
    currentCompany,
    jobPreferences,
    appliedJob,
    resume,
  } = req.body;

  // Check if job exists
  const job = await Job.findById(appliedJob);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  const candidate = await Candidate.create({
    firstName,
    lastName,
    email,
    phone,
    qualifications,
    experience,
    currentPosition,
    currentCompany,
    jobPreferences,
    appliedJob,
    resume,
  });

  res.status(201).json({
    success: true,
    message: 'Candidate created successfully',
    data: candidate,
  });
});

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private/HR
const updateCandidate = asyncHandler(async (req, res) => {
  let candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    res.status(404);
    throw new Error('Candidate not found');
  }

  // Check if job exists if it's being updated
  if (req.body.appliedJob) {
    const job = await Job.findById(req.body.appliedJob);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
  }

  candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Candidate updated successfully',
    data: candidate,
  });
});

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private/HR
const deleteCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    res.status(404);
    throw new Error('Candidate not found');
  }

  await candidate.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Candidate deleted successfully',
    data: {},
  });
});

// @desc    Update candidate status
// @route   PUT /api/candidates/:id/status
// @access  Private/HR
const updateCandidateStatus = asyncHandler(async (req, res) => {
  const { status, interviewDate, feedback } = req.body;

  let candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    res.status(404);
    throw new Error('Candidate not found');
  }

  candidate.status = status || candidate.status;
  candidate.interviewDate = interviewDate || candidate.interviewDate;
  candidate.feedback = feedback || candidate.feedback;

  await candidate.save();

  res.status(200).json({
    success: true,
    message: 'Candidate status updated successfully',
    data: candidate,
  });
});

module.exports = {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus,
};
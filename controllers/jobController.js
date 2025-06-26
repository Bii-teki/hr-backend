const Job = require('../models/Job');
const asyncHandler = require('express-async-handler');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private/HR
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private/HR
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    postedBy: req.user._id,
  }).populate('postedBy', 'name email');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/HR
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    responsibilities,
    department,
    location,
    employmentType,
    experienceLevel,
    salaryRange,
    deadline,
  } = req.body;

  const job = await Job.create({
    title,
    description,
    requirements,
    responsibilities,
    department,
    location,
    employmentType,
    experienceLevel,
    salaryRange,
    deadline,
    postedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: job,
  });
  console.log('Job created:', job);
  console.log('Posted by:', req.user._id);
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/HR
const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findOne({
    _id: req.params.id,
    postedBy: req.user._id,
  });

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: job,
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/HR
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    postedBy: req.user._id,
  });

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
    data: {},
  });
});

// @desc    Toggle job status (active/inactive)
// @route   PUT /api/jobs/:id/status
// @access  Private/HR
const toggleJobStatus = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    postedBy: req.user._id,
  });

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  job.isActive = !job.isActive;
  await job.save();

  res.status(200).json({
    success: true,
    message: `Job is now ${job.isActive ? 'active' : 'inactive'}`,
    data: job,
  });
});

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
};
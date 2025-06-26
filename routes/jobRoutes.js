const express = require('express');
const router = express.Router();
const { protect, isHR } = require('../middleware/authMiddleware');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus
} = require('../controllers/jobController');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job posting management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - requirements
 *         - responsibilities
 *         - department
 *         - location
 *         - employmentType
 *         - experienceLevel
 *       properties:
 *         title:
 *           type: string
 *           example: Senior Software Engineer
 *         description:
 *           type: string
 *           example: We are looking for an experienced software engineer...
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           example: ["5+ years of experience", "Proficiency in JavaScript"]
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Develop new features", "Code reviews"]
 *         department:
 *           type: string
 *           example: Engineering
 *         location:
 *           type: string
 *           example: Remote
 *         employmentType:
 *           type: string
 *           enum: [Full-time, Part-time, Contract, Internship]
 *           example: Full-time
 *         experienceLevel:
 *           type: string
 *           enum: [Entry, Mid, Senior, Executive]
 *           example: Senior
 *         salaryRange:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *               example: 80000
 *             max:
 *               type: number
 *               example: 120000
 *         deadline:
 *           type: string
 *           format: date
 *           example: 2023-12-31
 *         isActive:
 *           type: boolean
 *           default: true
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs posted by current HR user
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 */
router.route('/')
  .get(protect, isHR, getJobs);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 */
router.route('/')
  .post(protect, isHR, createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the job
 *     responses:
 *       200:
 *         description: Job data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 *       404:
 *         description: Job not found
 */
router.route('/:id')
  .get(protect, isHR, getJob);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update a job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 *       404:
 *         description: Job not found
 */
router.route('/:id')
  .put(protect, isHR, updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the job
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job deleted successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 *       404:
 *         description: Job not found
 */
router.route('/:id')
  .delete(protect, isHR, deleteJob);

/**
 * @swagger
 * /jobs/{id}/status:
 *   put:
 *     summary: Toggle job status (active/inactive)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the job
 *     responses:
 *       200:
 *         description: Job status toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job is now active
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 *       404:
 *         description: Job not found
 */
router.put('/:id/status', protect, isHR, toggleJobStatus);

module.exports = router;
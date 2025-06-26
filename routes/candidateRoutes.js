const express = require('express');
const router = express.Router();
const { protect, isHR } = require('../middleware/authMiddleware');
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus
} = require('../controllers/candidateController');

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Candidate management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Candidate:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - qualifications
 *         - experience
 *         - jobPreferences
 *         - appliedJob
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         qualifications:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Bachelor's in Computer Science", "AWS Certified"]
 *         experience:
 *           type: number
 *           example: 5
 *         currentPosition:
 *           type: string
 *           example: Senior Developer
 *         currentCompany:
 *           type: string
 *           example: Tech Corp
 *         jobPreferences:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Full-stack Developer", "Backend Engineer"]
 *         status:
 *           type: string
 *           enum: ["Applied", "Interviewing", "Offered", "Hired", "Rejected"]
 *           default: "Applied"
 *           example: Interviewing
 *         interviewDate:
 *           type: string
 *           format: date-time
 *           example: "2023-12-15T14:30:00Z"
 *         feedback:
 *           type: string
 *           example: "Strong technical skills but needs improvement in communication"
 *         resume:
 *           type: string
 *           format: uri
 *           example: "https://example.com/resumes/john-doe.pdf"
 *         appliedJob:
 *           type: string
 *           format: objectId
 *           example: "507f1f77bcf86cd799439011"
 *     StatusUpdate:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: ["Applied", "Interviewing", "Offered", "Hired", "Rejected"]
 *           example: Interviewing
 *         interviewDate:
 *           type: string
 *           format: date-time
 *           example: "2023-12-15T14:30:00Z"
 *         feedback:
 *           type: string
 *           example: "Strong technical skills but needs improvement in communication"
 *     AttentionCard:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Pending Reviews"
 *         count:
 *           type: integer
 *           example: 5
 *         description:
 *           type: string
 *           example: "Candidates awaiting initial review"
 *         priority:
 *           type: string
 *           enum: ["high", "medium", "low", "none"]
 *           example: "high"
 */

/**
 * @swagger
 * /candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all candidates with attention cards
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
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 *                 attentionCards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AttentionCard'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 */
router.route('/')
  .get(protect, isHR, getCandidates);

/**
 * @swagger
 * /candidates:
 *   post:
 *     summary: Create a new candidate
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidate'
 *     responses:
 *       201:
 *         description: Candidate created successfully
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
 *                   example: "Candidate created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 *       404:
 *         description: Job not found
 */
router.route('/')
  .post(protect, isHR, createCandidate);

/**
 * @swagger
 * /candidates/{id}:
 *   get:
 *     summary: Get a candidate by ID
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: MongoDB ObjectId of the candidate
 *     responses:
 *       200:
 *         description: Candidate data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 *       404:
 *         description: Candidate not found
 */
router.route('/:id')
  .get(protect, isHR, getCandidate);

/**
 * @swagger
 * /candidates/{id}:
 *   put:
 *     summary: Update a candidate
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: MongoDB ObjectId of the candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidate'
 *     responses:
 *       200:
 *         description: Candidate updated successfully
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
 *                   example: "Candidate updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 *       404:
 *         description: Candidate or Job not found
 */
router.route('/:id')
  .put(protect, isHR, updateCandidate);

/**
 * @swagger
 * /candidates/{id}:
 *   delete:
 *     summary: Delete a candidate
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: MongoDB ObjectId of the candidate
 *     responses:
 *       200:
 *         description: Candidate deleted successfully
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
 *                   example: "Candidate deleted successfully"
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 *       404:
 *         description: Candidate not found
 */
router.route('/:id')
  .delete(protect, isHR, deleteCandidate);

/**
 * @swagger
 * /candidates/{id}/status:
 *   put:
 *     summary: Update candidate status
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: MongoDB ObjectId of the candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *     responses:
 *       200:
 *         description: Candidate status updated successfully
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
 *                   example: "Candidate status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as HR personnel
 *       404:
 *         description: Candidate not found
 */
router.put('/:id/status', protect, isHR, updateCandidateStatus);

module.exports = router;
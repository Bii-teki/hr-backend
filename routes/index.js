const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/candidates', require('./candidateRoutes'));
router.use('/jobs', require('./jobRoutes'));

module.exports = router;
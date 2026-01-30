const express = require('express');
const reportService = require('../services/report.service');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const aiRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: 10, // Lower limit for report generation
  message: 'Too many report generation requests, please try again later'
});

router.post('/:interviewId', aiRateLimit, async (req, res, next) => {
  try {
    const report = await reportService.generateReport(req.params.interviewId, req.user._id);
    res.json({ report });
  } catch (error) {
    next(error);
  }
});

router.get('/:interviewId', async (req, res, next) => {
  try {
    const report = await reportService.getReport(req.params.interviewId, req.user._id);
    res.json({ report });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const reports = await reportService.getUserReports(req.user._id);
    res.json({ reports });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

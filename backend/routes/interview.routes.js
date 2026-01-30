const express = require('express');
const { body, validationResult } = require('express-validator');
const interviewService = require('../services/interview.service');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const aiRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later'
});

router.post('/', [
  body('resumeId').notEmpty(),
  body('role').isIn(['L3', 'L4']),
  body('focusAreas').isArray().notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resumeId, role, focusAreas } = req.body;
    const interview = await interviewService.createInterview(
      req.user._id,
      resumeId,
      role,
      focusAreas
    );

    res.status(201).json({ interview });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/start', async (req, res, next) => {
  try {
    const interview = await interviewService.startInterview(req.params.id, req.user._id);
    res.json({ interview });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/question', aiRateLimit, async (req, res, next) => {
  try {
    const question = await interviewService.generateQuestion(req.params.id, req.user._id);
    res.json({ question });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/answer', [
  body('questionId').notEmpty(),
  body('answerText').trim().notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questionId, answerText } = req.body;
    const answer = await interviewService.submitAnswer(
      req.params.id,
      questionId,
      req.user._id,
      answerText
    );

    res.json({ answer });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/complete', async (req, res, next) => {
  try {
    const interview = await interviewService.completeInterview(req.params.id, req.user._id);
    res.json({ interview });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const interviews = await interviewService.getUserInterviews(req.user._id);
    res.json({ interviews });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const interview = await interviewService.getInterview(req.params.id, req.user._id);
    res.json({ interview });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

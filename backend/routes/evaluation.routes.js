const express = require('express');
const evaluationService = require('../services/evaluation.service');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const aiRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later'
});

router.post('/:answerId', aiRateLimit, async (req, res, next) => {
  try {
    const answer = await evaluationService.evaluateAnswer(req.params.answerId);
    res.json({ answer });
  } catch (error) {
    next(error);
  }
});

router.post('/:interviewId/:questionId/follow-up', aiRateLimit, async (req, res, next) => {
  try {
    const followUp = await evaluationService.generateFollowUpQuestion(
      req.params.interviewId,
      req.params.questionId,
      req.user._id
    );
    res.json({ question: followUp });
  } catch (error) {
    next(error);
  }
});

router.get('/:answerId', async (req, res, next) => {
  try {
    const answer = await evaluationService.getAnswerEvaluation(req.params.answerId, req.user._id);
    res.json({ answer });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

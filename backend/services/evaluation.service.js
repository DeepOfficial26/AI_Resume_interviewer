const Answer = require('../models/Answer.model');
const Question = require('../models/Question.model');
const Interview = require('../models/Interview.model');
const aiService = require('./ai.service');
const promptService = require('./prompt.service');
const interviewService = require('./interview.service');
const logger = require('../utils/logger');

class EvaluationService {
  async evaluateAnswer(answerId) {
    const answer = await Answer.findById(answerId)
      .populate('questionId');
    
    if (!answer) {
      throw new Error('Answer not found');
    }

    const question = answer.questionId;
    
    // Generate evaluation using AI
    const prompt = promptService.generateEvaluationPrompt(
      question,
      answer.answerText,
      question.idealAnswer,
      question.evaluationCriteria
    );

    const evaluation = await aiService.generateJSON(prompt, {
      systemPrompt: 'You are an expert technical interviewer. Evaluate answers objectively and provide constructive feedback. Always return valid JSON.'
    });

    // Update answer with evaluation
    answer.evaluation = {
      score: evaluation.score,
      correctness: evaluation.correctness,
      depth: evaluation.depth,
      clarity: evaluation.clarity,
      realWorldRelevance: evaluation.realWorldRelevance,
      strengths: evaluation.strengths || [],
      improvements: evaluation.improvements || [],
      idealAnswer: question.idealAnswer,
      feedback: evaluation.feedback
    };
    answer.needsFollowUp = evaluation.needsFollowUp || false;
    answer.followUpReason = evaluation.followUpReason;
    answer.evaluatedAt = new Date();

    await answer.save();

    // Update interview skill breakdown
    await this.updateInterviewStats(answer.interviewId, question.category, evaluation.score);

    // Adjust difficulty based on score
    await interviewService.adjustDifficulty(answer.interviewId, evaluation.score);

    return answer;
  }

  async updateInterviewStats(interviewId, category, score) {
    const interview = await Interview.findById(interviewId);
    
    if (!interview.skillBreakdown) {
      interview.skillBreakdown = {};
    }

    if (!interview.skillBreakdown[category]) {
      interview.skillBreakdown[category] = { score: 0, questionsCount: 0 };
    }

    const current = interview.skillBreakdown[category];
    const newCount = current.questionsCount + 1;
    const newScore = ((current.score * current.questionsCount) + score) / newCount;

    interview.skillBreakdown[category] = {
      score: Math.round(newScore * 10) / 10,
      questionsCount: newCount
    };

    // Calculate overall score
    const categories = Object.values(interview.skillBreakdown);
    if (categories.length > 0) {
      const totalScore = categories.reduce((sum, cat) => sum + (cat.score * cat.questionsCount), 0);
      const totalCount = categories.reduce((sum, cat) => sum + cat.questionsCount, 0);
      interview.overallScore = Math.round((totalScore / totalCount) * 10) / 10;
    }

    await interview.save();
  }

  async generateFollowUpQuestion(interviewId, questionId, userId) {
    const answer = await Answer.findOne({ questionId, interviewId, userId })
      .populate('questionId');
    
    if (!answer || !answer.evaluation) {
      throw new Error('Answer not evaluated yet');
    }

    if (!answer.needsFollowUp) {
      throw new Error('Follow-up not needed for this answer');
    }

    const originalQuestion = answer.questionId;

    // Generate follow-up question
    const prompt = promptService.generateFollowUpPrompt(
      originalQuestion,
      answer.answerText,
      answer.evaluation
    );

    const followUpData = await aiService.generateJSON(prompt, {
      systemPrompt: 'You are an expert technical interviewer. Generate insightful follow-up questions. Always return valid JSON.'
    });

    // Save follow-up question
    const followUpQuestion = new Question({
      interviewId,
      questionText: followUpData.questionText,
      questionType: followUpData.questionType,
      category: followUpData.category,
      difficulty: followUpData.difficulty,
      role: originalQuestion.role,
      isFollowUp: true,
      parentQuestionId: questionId,
      idealAnswer: followUpData.idealAnswer,
      evaluationCriteria: originalQuestion.evaluationCriteria
    });

    await followUpQuestion.save();

    // Add to interview
    const interview = await Interview.findById(interviewId);
    interview.questions.push({
      questionId: followUpQuestion._id,
      questionText: followUpQuestion.questionText,
      questionType: followUpQuestion.questionType,
      category: followUpQuestion.category,
      difficulty: followUpQuestion.difficulty,
      askedAt: new Date()
    });

    await interview.save();

    return {
      questionId: followUpQuestion._id,
      questionText: followUpQuestion.questionText,
      questionType: followUpQuestion.questionType,
      category: followUpQuestion.category,
      difficulty: followUpQuestion.difficulty,
      reason: followUpData.reason
    };
  }

  async getAnswerEvaluation(answerId, userId) {
    const answer = await Answer.findById(answerId)
      .populate('questionId')
      .populate('interviewId');
    
    if (!answer || answer.userId.toString() !== userId.toString()) {
      throw new Error('Answer not found');
    }

    return answer;
  }
}

module.exports = new EvaluationService();

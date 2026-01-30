const Interview = require('../models/Interview.model');
const Question = require('../models/Question.model');
const Answer = require('../models/Answer.model');
const Resume = require('../models/Resume.model');
const aiService = require('./ai.service');
const promptService = require('./prompt.service');
const logger = require('../utils/logger');

class InterviewService {
  async createInterview(userId, resumeId, role, focusAreas) {
    const interview = new Interview({
      userId,
      resumeId,
      role,
      focusAreas,
      status: 'pending'
    });

    return await interview.save();
  }

  async startInterview(interviewId, userId) {
    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) {
      throw new Error('Interview not found');
    }

    interview.status = 'in-progress';
    interview.startedAt = new Date();
    await interview.save();

    return interview;
  }

  async generateQuestion(interviewId, userId) {
    const interview = await Interview.findOne({ _id: interviewId, userId })
      .populate('resumeId');
    
    if (!interview) {
      throw new Error('Interview not found');
    }

    if (interview.status !== 'in-progress') {
      throw new Error('Interview is not in progress');
    }

    const resume = interview.resumeId;
    if (!resume || resume.parsingStatus !== 'completed') {
      throw new Error('Resume not parsed yet');
    }

    // Determine focus area and difficulty
    const focusArea = this.selectFocusArea(interview);
    const difficulty = interview.currentDifficulty;

    // Get previous answers for context
    const previousAnswers = await this.getPreviousAnswers(interviewId);

    // Generate question using AI
    const prompt = promptService.generateQuestionPrompt(
      resume.parsedData,
      interview.role,
      focusArea,
      difficulty,
      previousAnswers
    );

    const questionData = await aiService.generateJSON(prompt, {
      systemPrompt: 'You are an expert technical interviewer. Always return valid JSON.'
    });

    // Save question
    const question = new Question({
      interviewId,
      questionText: questionData.questionText,
      questionType: questionData.questionType,
      category: questionData.category,
      difficulty: questionData.difficulty,
      role: interview.role,
      context: {
        resumeSkills: resume.parsedData.skills || [],
        resumeExperience: resume.parsedData.experience || [],
        previousAnswers: previousAnswers
      },
      idealAnswer: questionData.idealAnswer,
      evaluationCriteria: questionData.evaluationCriteria
    });

    await question.save();

    // Add to interview
    interview.questions.push({
      questionId: question._id,
      questionText: question.questionText,
      questionType: question.questionType,
      category: question.category,
      difficulty: question.difficulty,
      askedAt: new Date()
    });

    await interview.save();

    return {
      questionId: question._id,
      questionText: question.questionText,
      questionType: question.questionType,
      category: question.category,
      difficulty: question.difficulty
    };
  }

  selectFocusArea(interview) {
    const focusAreas = interview.focusAreas || [];
    if (focusAreas.length === 0) {
      return 'JavaScript'; // Default
    }

    // Simple round-robin or weighted selection
    const askedCategories = interview.questions.map(q => q.category);
    const categoryCounts = {};
    
    focusAreas.forEach(area => {
      categoryCounts[area] = askedCategories.filter(cat => cat === area).length;
    });

    // Select area with least questions asked
    const sortedAreas = Object.entries(categoryCounts)
      .sort((a, b) => a[1] - b[1]);
    
    return sortedAreas[0][0];
  }

  async getPreviousAnswers(interviewId) {
    const questions = await Question.find({ interviewId });
    const questionIds = questions.map(q => q._id);
    
    const answers = await Answer.find({ 
      questionId: { $in: questionIds } 
    }).populate('questionId');

    return answers.map(ans => ({
      questionText: ans.questionId.questionText,
      answerText: ans.answerText,
      evaluation: ans.evaluation
    }));
  }

  async submitAnswer(interviewId, questionId, userId, answerText) {
    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) {
      throw new Error('Interview not found');
    }

    const question = await Question.findById(questionId);
    if (!question || question.interviewId.toString() !== interviewId) {
      throw new Error('Question not found');
    }

    // Save answer
    const answer = new Answer({
      questionId,
      interviewId,
      userId,
      answerText
    });

    await answer.save();

    // Update interview question with answer
    const questionIndex = interview.questions.findIndex(
      q => q.questionId.toString() === questionId.toString()
    );
    
    if (questionIndex !== -1) {
      interview.questions[questionIndex].answeredAt = new Date();
      interview.questions[questionIndex].answerId = answer._id;
    }

    await interview.save();

    return answer;
  }

  async adjustDifficulty(interviewId, answerScore) {
    const interview = await Interview.findById(interviewId);
    
    if (answerScore >= 8) {
      // Strong answer - increase difficulty
      if (interview.currentDifficulty === 'beginner') {
        interview.currentDifficulty = 'intermediate';
      } else if (interview.currentDifficulty === 'intermediate') {
        interview.currentDifficulty = 'advanced';
      }
    } else if (answerScore < 5) {
      // Weak answer - decrease difficulty
      if (interview.currentDifficulty === 'advanced') {
        interview.currentDifficulty = 'intermediate';
      } else if (interview.currentDifficulty === 'intermediate') {
        interview.currentDifficulty = 'beginner';
      }
    }

    await interview.save();
  }

  async completeInterview(interviewId, userId) {
    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) {
      throw new Error('Interview not found');
    }

    interview.status = 'completed';
    interview.completedAt = new Date();
    await interview.save();

    return interview;
  }

  async getInterview(interviewId, userId) {
    const interview = await Interview.findOne({ _id: interviewId, userId })
      .populate('resumeId')
      .populate('questions.questionId');
    
    if (!interview) {
      throw new Error('Interview not found');
    }

    return interview;
  }

  async getUserInterviews(userId) {
    return await Interview.find({ userId })
      .populate('resumeId')
      .sort({ createdAt: -1 });
  }
}

module.exports = new InterviewService();

const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  role: {
    type: String,
    enum: ['L3', 'L4'],
    required: true
  },
  focusAreas: [{
    type: String,
    enum: ['JavaScript', 'Node.js internals', 'System Design', 'Databases', 'APIs & Security', 'Debugging & Performance']
  }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'abandoned'],
    default: 'pending'
  },
  currentDifficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    questionText: String,
    questionType: {
      type: String,
      enum: ['theory', 'coding', 'system-design', 'scenario']
    },
    category: String,
    difficulty: String,
    askedAt: Date,
    answeredAt: Date,
    answerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer'
    }
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 10
  },
  skillBreakdown: {
    JavaScript: { score: Number, questionsCount: Number },
    'Node.js internals': { score: Number, questionsCount: Number },
    'System Design': { score: Number, questionsCount: Number },
    Databases: { score: Number, questionsCount: Number },
    'APIs & Security': { score: Number, questionsCount: Number },
    'Debugging & Performance': { score: Number, questionsCount: Number }
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);

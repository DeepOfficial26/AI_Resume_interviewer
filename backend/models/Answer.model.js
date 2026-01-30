const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answerText: {
    type: String,
    required: true
  },
  evaluation: {
    score: {
      type: Number,
      min: 0,
      max: 10
    },
    correctness: {
      type: Number,
      min: 0,
      max: 10
    },
    depth: {
      type: Number,
      min: 0,
      max: 10
    },
    clarity: {
      type: Number,
      min: 0,
      max: 10
    },
    realWorldRelevance: {
      type: Number,
      min: 0,
      max: 10
    },
    strengths: [String],
    improvements: [String],
    idealAnswer: String,
    feedback: String
  },
  needsFollowUp: {
    type: Boolean,
    default: false
  },
  followUpReason: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  evaluatedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Answer', answerSchema);

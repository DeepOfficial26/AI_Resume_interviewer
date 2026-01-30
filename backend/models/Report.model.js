const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  skillBreakdown: {
    JavaScript: { score: Number, questionsCount: Number, feedback: String },
    'Node.js internals': { score: Number, questionsCount: Number, feedback: String },
    'System Design': { score: Number, questionsCount: Number, feedback: String },
    Databases: { score: Number, questionsCount: Number, feedback: String },
    'APIs & Security': { score: Number, questionsCount: Number, feedback: String },
    'Debugging & Performance': { score: Number, questionsCount: Number, feedback: String }
  },
  weakAreas: [{
    skill: String,
    score: Number,
    improvementPlan: String
  }],
  strongAreas: [{
    skill: String,
    score: Number,
    feedback: String
  }],
  summary: {
    type: String
  },
  recommendations: [String],
  pdfPath: {
    type: String
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);

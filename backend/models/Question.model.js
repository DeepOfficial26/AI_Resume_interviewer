const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['theory', 'coding', 'system-design', 'scenario'],
    required: true
  },
  category: {
    type: String,
    enum: ['JavaScript', 'Node.js internals', 'System Design', 'Databases', 'APIs & Security', 'Debugging & Performance'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  role: {
    type: String,
    enum: ['L3', 'L4'],
    required: true
  },
  context: {
    resumeSkills: [String],
    resumeExperience: [Object],
    previousAnswers: [Object]
  },
  idealAnswer: {
    type: String
  },
  evaluationCriteria: {
    type: Object
  },
  isFollowUp: {
    type: Boolean,
    default: false
  },
  parentQuestionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);

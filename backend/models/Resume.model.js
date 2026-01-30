const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true
  },
  parsedData: {
    skills: [String],
    experience: [{
      company: String,
      role: String,
      duration: String,
      description: String,
      technologies: [String]
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      duration: String
    }],
    techStack: [String],
    education: [{
      institution: String,
      degree: String,
      year: String
    }],
    certifications: [String]
  },
  rawText: {
    type: String
  },
  parsingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  parsingError: {
    type: String
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

module.exports = mongoose.model('Resume', resumeSchema);

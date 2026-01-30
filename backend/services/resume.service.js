const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume.model');
const aiService = require('./ai.service');
const logger = require('../utils/logger');

class ResumeService {
  async parseResume(filePath, fileType) {
    try {
      let text = '';

      if (fileType === 'pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        text = pdfData.text;
      } else if (fileType === 'docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
      }

      return await this.extractStructuredData(text);
    } catch (error) {
      logger.error('Resume parsing error:', error);
      throw new Error('Failed to parse resume');
    }
  }

  async extractStructuredData(text) {
    const prompt = `Extract structured information from the following resume text. 
    Return a JSON object with the following structure:
    {
      "skills": ["skill1", "skill2", ...],
      "experience": [
        {
          "company": "Company Name",
          "role": "Job Title",
          "duration": "Start - End",
          "description": "Job description",
          "technologies": ["tech1", "tech2"]
        }
      ],
      "projects": [
        {
          "name": "Project Name",
          "description": "Project description",
          "technologies": ["tech1", "tech2"],
          "duration": "Duration"
        }
      ],
      "techStack": ["technology1", "technology2", ...],
      "education": [
        {
          "institution": "Institution Name",
          "degree": "Degree",
          "year": "Year"
        }
      ],
      "certifications": ["cert1", "cert2", ...]
    }

    Resume Text:
    ${text.substring(0, 8000)}`;

    try {
      const structuredData = await aiService.generateJSON(prompt, {
        systemPrompt: 'You are an expert at extracting structured data from resumes. Always return valid JSON.'
      });

      return {
        ...structuredData,
        rawText: text
      };
    } catch (error) {
      logger.error('AI extraction error:', error);
      // Fallback to basic extraction
      return this.basicExtraction(text);
    }
  }

  basicExtraction(text) {
    const skills = [];
    const techStack = [];
    const experience = [];
    const projects = [];

    // Basic keyword extraction (fallback)
    const commonSkills = ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Git'];
    commonSkills.forEach(skill => {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        skills.push(skill);
        techStack.push(skill);
      }
    });

    return {
      skills,
      experience,
      projects,
      techStack,
      education: [],
      certifications: [],
      rawText: text
    };
  }

  async saveResume(userId, fileData, parsedData) {
    const resume = new Resume({
      userId,
      fileName: fileData.originalname,
      filePath: fileData.path,
      fileType: fileData.fileType,
      parsedData,
      rawText: parsedData.rawText,
      parsingStatus: 'completed'
    });

    return await resume.save();
  }

  async getResumeById(resumeId, userId) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new Error('Resume not found');
    }
    return resume;
  }

  async getUserResumes(userId) {
    return await Resume.find({ userId }).sort({ createdAt: -1 });
  }
}

module.exports = new ResumeService();

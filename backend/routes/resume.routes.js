const express = require('express');
const { upload } = require('../middleware/upload.middleware');
const resumeService = require('../services/resume.service');
const path = require('path');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/upload', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = path.extname(req.file.originalname).toLowerCase().slice(1);
    
    if (!['pdf', 'docx'].includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type. Only PDF and DOCX are allowed' });
    }

    // Parse resume
    const parsedData = await resumeService.parseResume(req.file.path, fileType);

    // Save resume
    const resume = await resumeService.saveResume(
      req.user._id,
      {
        originalname: req.file.originalname,
        path: req.file.path,
        fileType
      },
      parsedData
    );

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        parsingStatus: resume.parsingStatus,
        parsedData: resume.parsedData
      }
    });
  } catch (error) {
    logger.error('Resume upload error:', error);
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const resumes = await resumeService.getUserResumes(req.user._id);
    res.json({ resumes });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user._id);
    res.json({ resume });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

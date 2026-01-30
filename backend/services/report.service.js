const Report = require('../models/Report.model');
const Interview = require('../models/Interview.model');
const Answer = require('../models/Answer.model');
const Question = require('../models/Question.model');
const aiService = require('./ai.service');
const promptService = require('./prompt.service');
const logger = require('../utils/logger');

class ReportService {
  async generateReport(interviewId, userId) {
    const interview = await Interview.findOne({ _id: interviewId, userId })
      .populate('resumeId');
    
    if (!interview) {
      throw new Error('Interview not found');
    }

    if (interview.status !== 'completed') {
      throw new Error('Interview must be completed before generating report');
    }

    // Get all answers with evaluations
    const questionIds = interview.questions
      .filter(q => q.answerId)
      .map(q => q.answerId);
    
    const answers = await Answer.find({ _id: { $in: questionIds } })
      .populate('questionId');

    // Generate summary using AI
    const prompt = promptService.generateSummaryPrompt(interview, answers);
    const reportData = await aiService.generateJSON(prompt, {
      systemPrompt: 'You are an expert technical interviewer. Generate comprehensive, constructive interview reports. Always return valid JSON.'
    });

    // Create or update report
    let report = await Report.findOne({ interviewId });
    
    if (report) {
      report.overallScore = reportData.overallScore;
      report.skillBreakdown = reportData.skillBreakdown;
      report.weakAreas = reportData.weakAreas;
      report.strongAreas = reportData.strongAreas;
      report.summary = reportData.summary;
      report.recommendations = reportData.recommendations;
      report.generatedAt = new Date();
    } else {
      report = new Report({
        interviewId,
        userId,
        overallScore: reportData.overallScore,
        skillBreakdown: reportData.skillBreakdown,
        weakAreas: reportData.weakAreas,
        strongAreas: reportData.strongAreas,
        summary: reportData.summary,
        recommendations: reportData.recommendations
      });
    }

    await report.save();

    // TODO: Generate PDF (would require PDF generation library like pdfkit or puppeteer)
    // report.pdfPath = await this.generatePDF(report, interview, answers);

    return report;
  }

  async getReport(interviewId, userId) {
    const report = await Report.findOne({ interviewId, userId })
      .populate('interviewId');
    
    if (!report) {
      throw new Error('Report not found');
    }

    return report;
  }

  async getUserReports(userId) {
    return await Report.find({ userId })
      .populate('interviewId')
      .sort({ generatedAt: -1 });
  }

  // Placeholder for PDF generation
  async generatePDF(report, interview, answers) {
    // This would use a library like pdfkit or puppeteer
    // For now, return null
    logger.info('PDF generation not yet implemented');
    return null;
  }
}

module.exports = new ReportService();

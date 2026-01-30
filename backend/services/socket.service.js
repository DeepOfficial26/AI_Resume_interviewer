const logger = require('../utils/logger');
const interviewService = require('./interview.service');
const evaluationService = require('./evaluation.service');

const setupSocketIO = (io) => {
  io.use(async (socket, next) => {
    // Socket authentication would go here
    // For now, we'll use a simple token-based approach
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    // Verify token and attach user to socket
    socket.userId = socket.handshake.auth.userId;
    next();
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('start-interview', async (data) => {
      try {
        const { interviewId } = data;
        const interview = await interviewService.startInterview(interviewId, socket.userId);
        socket.emit('interview-started', { interview });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('request-question', async (data) => {
      try {
        const { interviewId } = data;
        const question = await interviewService.generateQuestion(interviewId, socket.userId);
        socket.emit('question-received', { question });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('submit-answer', async (data) => {
      try {
        const { interviewId, questionId, answerText } = data;
        const answer = await interviewService.submitAnswer(interviewId, questionId, socket.userId, answerText);
        
        // Auto-evaluate
        const evaluatedAnswer = await evaluationService.evaluateAnswer(answer._id);
        
        socket.emit('answer-evaluated', {
          answer: evaluatedAnswer,
          needsFollowUp: evaluatedAnswer.needsFollowUp
        });

        // Generate follow-up if needed
        if (evaluatedAnswer.needsFollowUp) {
          const followUp = await evaluationService.generateFollowUpQuestion(
            interviewId,
            questionId,
            socket.userId
          );
          socket.emit('follow-up-question', { question: followUp });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocketIO };

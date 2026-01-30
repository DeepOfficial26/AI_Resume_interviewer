require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const authRoutes = require('./backend/routes/auth.routes');
const resumeRoutes = require('./backend/routes/resume.routes');
const interviewRoutes = require('./backend/routes/interview.routes');
const evaluationRoutes = require('./backend/routes/evaluation.routes');
const reportRoutes = require('./backend/routes/report.routes');

const { errorHandler } = require('./backend/middleware/error.middleware');
const { authenticateToken } = require('./backend/middleware/auth.middleware');
const { setupSocketIO } = require('./backend/services/socket.service');
const logger = require('./backend/utils/logger');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', authenticateToken, resumeRoutes);
app.use('/api/interview', authenticateToken, interviewRoutes);
app.use('/api/evaluation', authenticateToken, evaluationRoutes);
app.use('/api/report', authenticateToken, reportRoutes);

// Socket.IO setup
setupSocketIO(io);

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };

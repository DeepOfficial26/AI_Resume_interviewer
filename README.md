# AI Smart Interview Preparation Platform

A production-ready AI-powered interview preparation platform specifically designed for L3/L4 Node.js backend engineers. The platform uses advanced AI to generate personalized interview questions, evaluate answers, and provide comprehensive feedback.

## 🎯 Features

### Core Capabilities

1. **Resume Upload & Parsing**
   - Accept PDF and DOCX resume formats
   - AI-powered extraction of skills, experience, projects, and tech stack
   - Structured JSON output for personalized question generation

2. **Role-Based Interview Preparation**
   - Support for L3 (Mid-level) and L4 (Senior) positions
   - Focus areas:
     - JavaScript
     - Node.js internals
     - System Design
     - Databases
     - APIs & Security
     - Debugging & Performance

3. **AI Interview Engine**
   - Personalized question generation based on resume and role
   - Dynamic difficulty adjustment based on performance
   - Multiple question types:
     - Theory questions
     - Coding questions
     - System design questions
     - Scenario-based questions

4. **Intelligent Answer Evaluation**
   - Multi-dimensional scoring (0-10):
     - Correctness
     - Depth
     - Clarity
     - Real-world relevance
   - Detailed feedback with:
     - Strengths identification
     - Improvement suggestions
     - Ideal answer references

5. **Follow-Up & Drill-Down**
   - Automatic follow-up questions for weak answers
   - Advanced questions for strong answers
   - Context-aware question progression

6. **Interview Summary Reports**
   - Comprehensive interview feedback
   - Skill-wise score breakdown
   - Weak areas identification with improvement plans
   - PDF export capability (planned)

## 🏗️ Architecture

### Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI**: OpenAI GPT-4 (with abstraction for Gemini support)
- **Frontend**: Angular 16
- **Real-time**: Socket.IO (WebSockets)
- **Authentication**: JWT
- **File Processing**: pdf-parse, mammoth

### Architecture Pattern

The project follows **Clean Architecture** principles:

```
backend/
├── models/          # Database models (MongoDB/Mongoose)
├── repositories/    # Data access layer
├── services/        # Business logic layer
├── routes/          # API endpoints (controllers)
├── middleware/      # Express middleware
└── utils/           # Utility functions
```

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+
- OpenAI API key (or Gemini API key)
- Angular CLI 16+ (for frontend)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd github_project
```

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
# - MongoDB connection string
# - JWT secret
# - OpenAI API key
# - Other settings

# Start MongoDB (if running locally)
# mongod

# Start the server
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:4200`

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# Database
MONGODB_URI=mongodb://localhost:27017/interview-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# AI Provider
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Resume Management

#### Upload Resume
```http
POST /api/resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <resume.pdf or resume.docx>
```

**Response:**
```json
{
  "message": "Resume uploaded and parsed successfully",
  "resume": {
    "id": "resume-id",
    "fileName": "resume.pdf",
    "parsingStatus": "completed",
    "parsedData": {
      "skills": ["JavaScript", "Node.js", ...],
      "experience": [...],
      "projects": [...],
      "techStack": [...]
    }
  }
}
```

#### Get Resumes
```http
GET /api/resume
Authorization: Bearer <token>
```

### Interview Management

#### Create Interview
```http
POST /api/interview
Authorization: Bearer <token>
Content-Type: application/json

{
  "resumeId": "resume-id",
  "role": "L3",
  "focusAreas": ["JavaScript", "Node.js internals", "System Design"]
}
```

#### Start Interview
```http
POST /api/interview/:id/start
Authorization: Bearer <token>
```

#### Generate Question
```http
POST /api/interview/:id/question
Authorization: Bearer <token>
```

**Response:**
```json
{
  "question": {
    "questionId": "question-id",
    "questionText": "Explain the event loop in Node.js...",
    "questionType": "theory",
    "category": "Node.js internals",
    "difficulty": "intermediate"
  }
}
```

#### Submit Answer
```http
POST /api/interview/:id/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionId": "question-id",
  "answerText": "The event loop is..."
}
```

### Evaluation

#### Evaluate Answer
```http
POST /api/evaluation/:answerId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "answer": {
    "evaluation": {
      "score": 8.5,
      "correctness": 9,
      "depth": 8,
      "clarity": 8,
      "realWorldRelevance": 9,
      "strengths": ["Clear explanation", "Good examples"],
      "improvements": ["Could mention microtasks"],
      "feedback": "Excellent answer with good depth..."
    },
    "needsFollowUp": false
  }
}
```

#### Generate Follow-Up Question
```http
POST /api/evaluation/:interviewId/:questionId/follow-up
Authorization: Bearer <token>
```

### Reports

#### Generate Report
```http
POST /api/report/:interviewId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "report": {
    "overallScore": 8.2,
    "skillBreakdown": {
      "JavaScript": { "score": 8.5, "questionsCount": 5, "feedback": "..." },
      "Node.js internals": { "score": 8.0, "questionsCount": 4, "feedback": "..." }
    },
    "weakAreas": [...],
    "strongAreas": [...],
    "summary": "...",
    "recommendations": [...]
  }
}
```

## 🔌 WebSocket Events

### Client → Server

- `start-interview`: Start an interview session
- `request-question`: Request next question
- `submit-answer`: Submit answer for evaluation

### Server → Client

- `interview-started`: Interview session started
- `question-received`: New question generated
- `answer-evaluated`: Answer evaluation completed
- `follow-up-question`: Follow-up question generated
- `error`: Error occurred

## 📊 Database Schema

### User
- `_id`: ObjectId
- `email`: String (unique)
- `password`: String (hashed)
- `name`: String
- `role`: String (candidate/admin)
- `preferences`: Object

### Resume
- `_id`: ObjectId
- `userId`: ObjectId (ref: User)
- `fileName`: String
- `filePath`: String
- `fileType`: String (pdf/docx)
- `parsedData`: Object
- `parsingStatus`: String

### Interview
- `_id`: ObjectId
- `userId`: ObjectId (ref: User)
- `resumeId`: ObjectId (ref: Resume)
- `role`: String (L3/L4)
- `focusAreas`: Array
- `status`: String
- `currentDifficulty`: String
- `questions`: Array
- `overallScore`: Number
- `skillBreakdown`: Object

### Question
- `_id`: ObjectId
- `interviewId`: ObjectId (ref: Interview)
- `questionText`: String
- `questionType`: String
- `category`: String
- `difficulty`: String
- `idealAnswer`: String
- `evaluationCriteria`: Object

### Answer
- `_id`: ObjectId
- `questionId`: ObjectId (ref: Question)
- `interviewId`: ObjectId (ref: Interview)
- `userId`: ObjectId (ref: User)
- `answerText`: String
- `evaluation`: Object
- `needsFollowUp`: Boolean

### Report
- `_id`: ObjectId
- `interviewId`: ObjectId (ref: Interview)
- `userId`: ObjectId (ref: User)
- `overallScore`: Number
- `skillBreakdown`: Object
- `weakAreas`: Array
- `strongAreas`: Array
- `summary`: String
- `recommendations`: Array

## 🎨 Frontend Structure

```
frontend/src/
├── app/
│   ├── core/
│   │   ├── services/      # Core services (auth, API)
│   │   ├── guards/         # Route guards
│   │   └── interceptors/  # HTTP interceptors
│   └── features/
│       ├── auth/          # Authentication module
│       ├── resume/        # Resume management
│       ├── interview/     # Interview session
│       └── dashboard/     # Dashboard
└── environments/         # Environment configs
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting for AI API calls
- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🐳 Docker Deployment

```dockerfile
# Dockerfile example (to be added)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance Considerations

- Rate limiting on AI API calls
- Async/await for non-blocking operations
- Database indexing on frequently queried fields
- File upload size limits
- Connection pooling for MongoDB

## 🛠️ Development

### Project Structure

```
github_project/
├── backend/
│   ├── models/           # Mongoose models
│   ├── repositories/     # Data access layer
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── utils/            # Utilities
├── frontend/             # Angular application
├── docs/                 # Documentation
├── uploads/              # Uploaded files
├── server.js             # Entry point
├── package.json
└── README.md
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for Node.js backend engineers preparing for L3/L4 interviews**

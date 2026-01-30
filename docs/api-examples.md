# API Request/Response Examples

## Authentication

### Register User

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "email": "john.doe@example.com",
    "name": "John Doe"
  }
}
```

### Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "email": "john.doe@example.com",
    "name": "John Doe"
  }
}
```

## Resume Management

### Upload Resume

**Request:**
```bash
curl -X POST http://localhost:3000/api/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

**Response:**
```json
{
  "message": "Resume uploaded and parsed successfully",
  "resume": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "fileName": "resume.pdf",
    "parsingStatus": "completed",
    "parsedData": {
      "skills": [
        "JavaScript",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "Redis",
        "Docker",
        "AWS"
      ],
      "experience": [
        {
          "company": "Tech Corp",
          "role": "Senior Backend Engineer",
          "duration": "2020 - Present",
          "description": "Led development of microservices architecture...",
          "technologies": ["Node.js", "MongoDB", "Docker", "Kubernetes"]
        }
      ],
      "projects": [
        {
          "name": "E-commerce API",
          "description": "Built scalable REST API for e-commerce platform",
          "technologies": ["Node.js", "Express", "MongoDB"],
          "duration": "6 months"
        }
      ],
      "techStack": [
        "JavaScript",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL"
      ],
      "education": [
        {
          "institution": "University of Technology",
          "degree": "BS Computer Science",
          "year": "2018"
        }
      ],
      "certifications": [
        "AWS Certified Solutions Architect"
      ]
    }
  }
}
```

### Get All Resumes

**Request:**
```bash
curl -X GET http://localhost:3000/api/resume \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "resumes": [
    {
      "id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "fileName": "resume.pdf",
      "fileType": "pdf",
      "parsingStatus": "completed",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Interview Management

### Create Interview

**Request:**
```bash
curl -X POST http://localhost:3000/api/interview \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "64a1b2c3d4e5f6g7h8i9j0k2",
    "role": "L4",
    "focusAreas": [
      "JavaScript",
      "Node.js internals",
      "System Design",
      "Databases"
    ]
  }'
```

**Response:**
```json
{
  "interview": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "resumeId": "64a1b2c3d4e5f6g7h8i9j0k2",
    "role": "L4",
    "focusAreas": [
      "JavaScript",
      "Node.js internals",
      "System Design",
      "Databases"
    ],
    "status": "pending",
    "currentDifficulty": "intermediate",
    "questions": [],
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### Start Interview

**Request:**
```bash
curl -X POST http://localhost:3000/api/interview/64a1b2c3d4e5f6g7h8i9j0k3/start \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "interview": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "status": "in-progress",
    "startedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

### Generate Question

**Request:**
```bash
curl -X POST http://localhost:3000/api/interview/64a1b2c3d4e5f6g7h8i9j0k3/question \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "question": {
    "questionId": "64a1b2c3d4e5f6g7h8i9j0k4",
    "questionText": "Explain how the Node.js event loop works, including the different phases and how they interact with the call stack and callback queue.",
    "questionType": "theory",
    "category": "Node.js internals",
    "difficulty": "intermediate"
  }
}
```

### Submit Answer

**Request:**
```bash
curl -X POST http://localhost:3000/api/interview/64a1b2c3d4e5f6g7h8i9j0k3/answer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "64a1b2c3d4e5f6g7h8i9j0k4",
    "answerText": "The Node.js event loop is a single-threaded mechanism that allows Node.js to perform non-blocking I/O operations. It consists of several phases: timers, pending callbacks, idle/prepare, poll, check, and close callbacks. The event loop continuously checks for callbacks in these phases and executes them..."
  }'
```

**Response:**
```json
{
  "answer": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
    "questionId": "64a1b2c3d4e5f6g7h8i9j0k4",
    "interviewId": "64a1b2c3d4e5f6g7h8i9j0k3",
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "answerText": "The Node.js event loop is...",
    "submittedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

## Evaluation

### Evaluate Answer

**Request:**
```bash
curl -X POST http://localhost:3000/api/evaluation/64a1b2c3d4e5f6g7h8i9j0k5 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "answer": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
    "evaluation": {
      "score": 8.5,
      "correctness": 9,
      "depth": 8,
      "clarity": 8.5,
      "realWorldRelevance": 8.5,
      "strengths": [
        "Clear explanation of event loop phases",
        "Good understanding of non-blocking I/O",
        "Mentioned call stack and callback queue"
      ],
      "improvements": [
        "Could explain microtasks vs macrotasks",
        "Could provide examples of each phase",
        "Could discuss performance implications"
      ],
      "feedback": "Excellent answer demonstrating strong understanding of Node.js internals. The explanation covers the main phases well. To improve, consider discussing microtasks and providing concrete examples.",
      "idealAnswer": "The Node.js event loop is a single-threaded, event-driven architecture that enables asynchronous operations..."
    },
    "needsFollowUp": false,
    "evaluatedAt": "2024-01-15T10:46:00.000Z"
  }
}
```

### Generate Follow-Up Question

**Request:**
```bash
curl -X POST http://localhost:3000/api/evaluation/64a1b2c3d4e5f6g7h8i9j0k3/64a1b2c3d4e5f6g7h8i9j0k4/follow-up \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "question": {
    "questionId": "64a1b2c3d4e5f6g7h8i9j0k6",
    "questionText": "Can you explain the difference between process.nextTick() and setImmediate() in the Node.js event loop?",
    "questionType": "theory",
    "category": "Node.js internals",
    "difficulty": "advanced",
    "reason": "To test deeper understanding of event loop microtasks"
  }
}
```

## Reports

### Generate Report

**Request:**
```bash
curl -X POST http://localhost:3000/api/report/64a1b2c3d4e5f6g7h8i9j0k3 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "report": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k7",
    "interviewId": "64a1b2c3d4e5f6g7h8i9j0k3",
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "overallScore": 8.2,
    "skillBreakdown": {
      "JavaScript": {
        "score": 8.5,
        "questionsCount": 5,
        "feedback": "Strong understanding of JavaScript fundamentals, closures, and async patterns."
      },
      "Node.js internals": {
        "score": 8.0,
        "questionsCount": 4,
        "feedback": "Good grasp of event loop, but could improve on microtasks understanding."
      },
      "System Design": {
        "score": 7.5,
        "questionsCount": 3,
        "feedback": "Able to design basic systems, but needs more practice with scalability patterns."
      },
      "Databases": {
        "score": 8.8,
        "questionsCount": 4,
        "feedback": "Excellent knowledge of both SQL and NoSQL databases, indexing, and query optimization."
      }
    },
    "weakAreas": [
      {
        "skill": "System Design",
        "score": 7.5,
        "improvementPlan": "Focus on learning scalability patterns, load balancing, caching strategies, and distributed systems concepts. Practice designing systems for high traffic."
      }
    ],
    "strongAreas": [
      {
        "skill": "Databases",
        "score": 8.8,
        "feedback": "Excellent understanding of database concepts, optimization, and both relational and non-relational databases."
      },
      {
        "skill": "JavaScript",
        "score": 8.5,
        "feedback": "Strong foundation in JavaScript, including advanced concepts like closures, promises, and async/await."
      }
    ],
    "summary": "Overall, the candidate demonstrates strong technical knowledge suitable for an L4 position. The interview revealed excellent database skills and solid JavaScript fundamentals. The main area for improvement is system design, particularly around scalability and distributed systems. With focused practice on system design patterns, the candidate would be well-prepared for senior backend engineering roles.",
    "recommendations": [
      "Study system design patterns and scalability strategies",
      "Practice designing systems for high-traffic scenarios",
      "Review microtasks vs macrotasks in Node.js event loop",
      "Continue building on strong database knowledge",
      "Consider contributing to open-source projects to gain real-world experience"
    ],
    "generatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### Get Report

**Request:**
```bash
curl -X GET http://localhost:3000/api/report/64a1b2c3d4e5f6g7h8i9j0k3 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "report": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k7",
    "overallScore": 8.2,
    "skillBreakdown": { ... },
    "summary": "...",
    "recommendations": [ ... ]
  }
}
```

# AI Interaction Flow

## AI Service Architecture

```mermaid
graph TB
    subgraph "AI Service Abstraction"
        A[AI Service] --> B{Provider?}
        B -->|OpenAI| C[OpenAI Client]
        B -->|Gemini| D[Gemini Client]
    end
    
    subgraph "Prompt Service"
        E[Prompt Service] --> F[Question Generation]
        E --> G[Answer Evaluation]
        E --> H[Follow-Up Generation]
        E --> I[Report Generation]
    end
    
    subgraph "Business Services"
        J[Interview Service] --> E
        K[Evaluation Service] --> E
        L[Report Service] --> E
        M[Resume Service] --> E
    end
    
    F --> A
    G --> A
    H --> A
    I --> A
```

## Question Generation Flow

```mermaid
sequenceDiagram
    participant Interview Service
    participant Prompt Service
    participant AI Service
    participant OpenAI
    
    Interview Service->>Prompt Service: generateQuestionPrompt()
    Note over Prompt Service: Build prompt with:<br/>- Resume data<br/>- Role (L3/L4)<br/>- Focus area<br/>- Difficulty<br/>- Previous answers
    
    Prompt Service-->>Interview Service: Prompt String
    
    Interview Service->>AI Service: generateJSON(prompt)
    AI Service->>OpenAI: Chat Completion Request
    OpenAI-->>AI Service: JSON Response
    
    AI Service-->>Interview Service: Question Data
    Note over Interview Service: Save question to DB
```

## Answer Evaluation Flow

```mermaid
sequenceDiagram
    participant Evaluation Service
    participant Prompt Service
    participant AI Service
    participant OpenAI
    
    Evaluation Service->>Prompt Service: generateEvaluationPrompt()
    Note over Prompt Service: Build prompt with:<br/>- Question<br/>- Answer<br/>- Ideal answer<br/>- Evaluation criteria
    
    Prompt Service-->>Evaluation Service: Prompt String
    
    Evaluation Service->>AI Service: generateJSON(prompt)
    AI Service->>OpenAI: Chat Completion Request
    OpenAI-->>AI Service: JSON Response
    
    AI Service-->>Evaluation Service: Evaluation Data
    Note over Evaluation Service: Update answer,<br/>update interview stats,<br/>adjust difficulty
```

## Prompt Template Structure

### Question Generation Prompt
```
Generate a {difficulty} level {focusArea} interview question for a {role} Node.js backend engineer position.

Resume Context:
- Skills: [...]
- Experience: [...]
- Projects: [...]

Previous Answers Context:
- Q1: ... A1: ... Score: ...
- Q2: ... A2: ... Score: ...

Requirements:
- Appropriate for {role} level
- Focus on: {focusArea}
- Difficulty: {difficulty}
- Personalized based on resume

Response Format: JSON with questionText, questionType, category, difficulty, idealAnswer, evaluationCriteria
```

### Evaluation Prompt
```
Evaluate the following interview answer for a Node.js backend engineering position.

Question: {questionText}
Question Type: {questionType}
Category: {category}
Difficulty: {difficulty}

Candidate's Answer:
{answer}

Ideal Answer Reference:
{idealAnswer}

Evaluation Criteria:
{criteria}

Evaluate on:
1. Correctness (0-10)
2. Depth (0-10)
3. Clarity (0-10)
4. Real-world Relevance (0-10)

Provide: strengths, improvements, feedback, needsFollowUp

Response Format: JSON with scores, strengths, improvements, feedback
```

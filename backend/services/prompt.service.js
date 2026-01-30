const aiService = require('./ai.service');

class PromptService {
  generateQuestionPrompt(resumeData, role, focusArea, difficulty, previousAnswers = []) {
    const resumeContext = `
Resume Skills: ${resumeData.skills?.join(', ') || 'Not specified'}
Tech Stack: ${resumeData.techStack?.join(', ') || 'Not specified'}
Experience: ${JSON.stringify(resumeData.experience || [])}
Projects: ${JSON.stringify(resumeData.projects || [])}
`;

    const previousContext = previousAnswers.length > 0
      ? `\nPrevious answers context:\n${previousAnswers.map((ans, idx) => 
          `Q${idx + 1}: ${ans.questionText}\nA${idx + 1}: ${ans.answerText}\nScore: ${ans.evaluation?.score || 'N/A'}\n`
        ).join('\n')}`
      : '';

    return `Generate a ${difficulty} level ${focusArea} interview question for a ${role} Node.js backend engineer position.

${resumeContext}
${previousContext}

Requirements:
- Question should be appropriate for ${role} level
- Focus on: ${focusArea}
- Difficulty: ${difficulty}
- Make it personalized based on the candidate's resume
- Question type should be one of: theory, coding, system-design, or scenario
- For coding questions, provide a clear problem statement
- For system design, provide a realistic scenario
- For theory questions, test deep understanding
- For scenario questions, present a real-world problem

Respond in JSON format:
{
  "questionText": "The question text",
  "questionType": "theory|coding|system-design|scenario",
  "category": "${focusArea}",
  "difficulty": "${difficulty}",
  "idealAnswer": "A comprehensive ideal answer",
  "evaluationCriteria": {
    "keyPoints": ["point1", "point2", "point3"],
    "expectedDepth": "description of expected depth",
    "commonMistakes": ["mistake1", "mistake2"]
  }
}`;
  }

  generateEvaluationPrompt(question, answer, idealAnswer, evaluationCriteria) {
    return `Evaluate the following interview answer for a Node.js backend engineering position.

Question: ${question.questionText}
Question Type: ${question.questionType}
Category: ${question.category}
Difficulty: ${question.difficulty}

Candidate's Answer:
${answer}

Ideal Answer Reference:
${idealAnswer}

Evaluation Criteria:
${JSON.stringify(evaluationCriteria, null, 2)}

Evaluate the answer on the following dimensions (0-10 scale):
1. Correctness: Is the answer factually correct?
2. Depth: Does it show deep understanding?
3. Clarity: Is it well-explained and clear?
4. Real-world Relevance: Does it connect to practical scenarios?

Provide:
- Strengths: What did the candidate do well?
- Improvements: What could be better?
- Specific feedback: Actionable suggestions

Respond in JSON format:
{
  "score": <overall score 0-10>,
  "correctness": <0-10>,
  "depth": <0-10>,
  "clarity": <0-10>,
  "realWorldRelevance": <0-10>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "feedback": "Detailed feedback text",
  "needsFollowUp": <boolean>,
  "followUpReason": "reason if needsFollowUp is true"
}`;
  }

  generateFollowUpPrompt(originalQuestion, originalAnswer, evaluation) {
    return `Generate a follow-up question based on the candidate's previous answer.

Original Question: ${originalQuestion.questionText}
Original Answer: ${originalAnswer}
Evaluation: ${JSON.stringify(evaluation, null, 2)}

Generate a follow-up question that:
- Drills deeper into weak areas if the answer was weak
- Explores advanced concepts if the answer was strong
- Tests understanding of related concepts
- Is appropriate for the same difficulty level or slightly adjusted

Respond in JSON format:
{
  "questionText": "The follow-up question",
  "questionType": "theory|coding|system-design|scenario",
  "category": "${originalQuestion.category}",
  "difficulty": "beginner|intermediate|advanced",
  "idealAnswer": "Ideal answer for the follow-up",
  "reason": "Why this follow-up question is being asked"
}`;
  }

  generateSummaryPrompt(interviewData, allAnswers) {
    const skillScores = Object.entries(interviewData.skillBreakdown || {})
      .map(([skill, data]) => `${skill}: ${data.score || 0}/10 (${data.questionsCount || 0} questions)`)
      .join('\n');

    const answersSummary = allAnswers.map((ans, idx) => 
      `Q${idx + 1} (${ans.category}): ${ans.evaluation?.score || 'N/A'}/10`
    ).join('\n');

    return `Generate a comprehensive interview summary report for a Node.js backend engineering interview.

Role: ${interviewData.role}
Focus Areas: ${interviewData.focusAreas?.join(', ')}

Skill Breakdown:
${skillScores}

Answer Summary:
${answersSummary}

Generate:
1. Overall assessment (2-3 paragraphs)
2. Skill-wise breakdown with feedback for each area
3. Weak areas identification with specific improvement plans
4. Strong areas recognition
5. Actionable recommendations for improvement

Respond in JSON format:
{
  "overallScore": <0-10>,
  "summary": "Overall assessment text (2-3 paragraphs)",
  "skillBreakdown": {
    "<skill>": {
      "score": <0-10>,
      "feedback": "Detailed feedback for this skill"
    }
  },
  "weakAreas": [
    {
      "skill": "<skill name>",
      "score": <0-10>,
      "improvementPlan": "Specific improvement plan"
    }
  ],
  "strongAreas": [
    {
      "skill": "<skill name>",
      "score": <0-10>,
      "feedback": "What they did well"
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}`;
  }
}

module.exports = new PromptService();

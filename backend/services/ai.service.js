const { OpenAI } = require('openai');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai';
    
    if (this.provider === 'openai') {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else if (this.provider === 'gemini') {
      // Gemini implementation would go here
      throw new Error('Gemini provider not yet implemented');
    }
  }

  async generateText(prompt, options = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || 'gpt-4',
        messages: [
          { role: 'system', content: options.systemPrompt || 'You are an expert technical interviewer specializing in Node.js backend engineering.' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('AI service error:', error);
      throw new Error('AI service unavailable');
    }
  }

  async generateJSON(prompt, options = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || 'gpt-4',
        messages: [
          { role: 'system', content: options.systemPrompt || 'You are an expert technical interviewer. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      logger.error('AI JSON generation error:', error);
      throw new Error('AI service unavailable');
    }
  }
}

module.exports = new AIService();

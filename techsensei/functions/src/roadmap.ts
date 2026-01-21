import * as functions from 'firebase-functions/v1';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAI = () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    return new GoogleGenerativeAI(apiKey);
};

export const generateRoadmap = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { topic, level, goal, duration } = data;

    if (!topic || !level) {
        throw new functions.https.HttpsError('invalid-argument', 'Topic and level are required');
    }

    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Create a detailed learning roadmap for "${topic}".
      Target Level: ${level}
      User's Main Goal: ${goal || 'General Mastery'}
      Available Timeframe: ${duration || '4 weeks'}

      Structure the roadmap as a JSON object with the following schema:
      {
        "title": "Title of the roadmap",
        "description": "Brief overview",
        "steps": [
          {
            "id": "step-1",
            "title": "Step Title (e.g., Week 1: Basics)",
            "description": "What to learn in this step",
            "resources": [
              { "title": "Resource Name", "type": "article|video|practice", "url": "valid_url_or_placeholder" }
            ],
            "estimatedTime": "e.g., 5 hours"
          }
        ]
      }
      
      Ensure the JSON is valid and strictly follows the schema. Do not include markdown formatting like \`\`\`json.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Clean up any potential markdown formatting
        const jsonString = text.replace(/```json\n|\n```/g, '').trim();

        const roadmapData = JSON.parse(jsonString);

        // Add metadata
        return {
            ...roadmapData,
            createdAt: new Date().toISOString(),
            topic,
            level,
            totalSteps: roadmapData.steps.length
        };

    } catch (error: any) {
        console.error('Error generating roadmap:', error);

        // Mock response for testing/errors
        if (process.env.FUNCTIONS_EMULATOR) {
            return {
                title: `[MOCK] Roadmap for ${topic}`,
                description: `A simulated path to master ${topic} at ${level} level.`,
                steps: [
                    {
                        id: 'step-1',
                        title: 'Week 1: Foundations',
                        description: 'Understand the core concepts.',
                        resources: [
                            { title: 'Official Documentation', type: 'article', url: '#' },
                            { title: 'Crash Course', type: 'video', url: '#' }
                        ],
                        estimatedTime: '5 hours'
                    },
                    {
                        id: 'step-2',
                        title: 'Week 2: Advanced Topics',
                        description: 'Dive deeper into complex features.',
                        resources: [
                            { title: 'Advanced patterns', type: 'article', url: '#' }
                        ],
                        estimatedTime: '7 hours'
                    }
                ],
                createdAt: new Date().toISOString(),
                topic,
                level,
                totalSteps: 2
            };
        }

        throw new functions.https.HttpsError('internal', 'Failed to generate roadmap');
    }
});

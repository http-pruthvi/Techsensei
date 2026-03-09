import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyAuth, handleOptions, errorResponse, successResponse } from './_utils';

const getGenAI = () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    return new GoogleGenerativeAI(apiKey);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        return handleOptions(res);
    }

    if (req.method !== 'POST') {
        return errorResponse(res, 'Method not allowed', 405);
    }

    const decodedToken = await verifyAuth(req);
    if (!decodedToken) {
        return errorResponse(res, 'Unauthorized', 401);
    }

    try {
        const { topic, level, goal, duration } = req.body || {};

        if (!topic || !level) {
            return errorResponse(res, 'Topic and level are required', 400);
        }

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
            "title": "Step Title",
            "description": "What to learn in this step",
            "resources": [
              { "title": "Resource Name", "type": "article|video|practice", "url": "valid_url_or_placeholder" }
            ],
            "estimatedTime": "e.g., 5 hours"
          }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonString = text.replace(/```json\n|\n```/g, '').trim();

        const roadmapData = JSON.parse(jsonString);

        return successResponse(res, {
            ...roadmapData,
            createdAt: new Date().toISOString(),
            topic,
            level,
            totalSteps: roadmapData.steps.length
        });
    } catch (error: unknown) {
        console.error('Roadmap Error:', error);
        return errorResponse(res, (error as Error).message || 'Internal Server Error');
    }
}

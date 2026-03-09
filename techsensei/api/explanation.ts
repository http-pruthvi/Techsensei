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
        const { action, ...data } = req.body || {};

        if (action === 'generate') {
            return await generateExplanation(res, data);
        } else if (action === 'simplify') {
            return await simplifyConcept(res, data);
        } else {
            return errorResponse(res, 'Invalid action', 400);
        }
    } catch (error: unknown) {
        console.error('API Error:', error);
        return errorResponse(res, (error as Error).message || 'Internal Server Error');
    }
}

async function generateExplanation(res: VercelResponse, data: Record<string, unknown>) {
    const { topic, level, preference, context: userContext } = data as { topic: string, level: string, preference: string, context?: string };

    if (!topic) {
        return errorResponse(res, 'Topic is required', 400);
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert technical teacher named TechSensei. 
      Your goal is to explain the concept of "${topic}" to a student.
      
      Parameters:
      - Level: ${level}
      - Preference: ${preference} (Focus on ${preference === 'visual' ? 'diagrams/flowcharts (using mermaid syntax)' : 'clear text descriptions'})
      ${userContext ? `- Context: ${userContext}` : ''}

      Structure the response in JSON format with the following schema:
      {
        "content": "The main explanation in Markdown format. Use simple language for beginners. If visual is preferred, include mermaid diagrams wrapped in \`\`\`mermaid blocks.",
        "estimatedReadTime": number,
        "relatedConcepts": ["concept1", "concept2", ...],
        "practicalApplications": ["application1", "application2", ...],
        "difficulty": number
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.replace(/```json\n|\n```/g, '').trim();

    return successResponse(res, JSON.parse(jsonString));
}

async function simplifyConcept(res: VercelResponse, data: Record<string, unknown>) {
    const { text, level = 'beginner' } = data as { text: string, level?: string };

    if (!text) {
        return errorResponse(res, 'Text to simplify is required', 400);
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert technical teacher named TechSensei. 
      Your goal is to simplify the following technical text for a ${level} audience.
      
      Original Text:
      "${text}"

      Structure the response in JSON format with the following schema:
      {
        "simplifiedText": "The simplified explanation in Markdown.",
        "keyPoints": ["point 1", "point 2", ...],
        "analogy": "A simple analogy to explain the concept"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();
    const jsonString = resultText.replace(/```json\n|\n```/g, '').trim();

    return successResponse(res, JSON.parse(jsonString));
}

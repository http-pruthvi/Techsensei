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
        const { repoUrl } = req.body || {};

        if (!repoUrl) {
            return errorResponse(res, 'Repository URL is required', 400);
        }

        if (!repoUrl.includes('github.com')) {
            return errorResponse(res, 'Invalid GitHub URL', 400);
        }

        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an expert Senior Software Architect.
      Your task is to analyze the GitHub repository at: "${repoUrl}".
      
      Since you cannot browse the live web, use your internal knowledge about this repository (if it's a popular public one) 
      or infer the likely structure and stack based on standard practices for a repository with this name/context.
      
      Provide the analysis in the following JSON format:
      {
        "overview": "Brief summary of what the project does.",
        "languages": [
           { "name": "LanguageName", "percentage": number, "color": "hexColor" }
        ],
        "architecture": "Description of the architectural pattern",
        "complexity": {
           "score": number,
           "reasoning": "Why this score?"
        },
        "recommendations": ["Rec 1", "Rec 2", "Rec 3"]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonString = text.replace(/```json\n|\n```/g, '').trim();

        return successResponse(res, JSON.parse(jsonString));
    } catch (error: unknown) {
        console.error('Analysis Error:', error);
        return errorResponse(res, (error as Error).message || 'Internal Server Error');
    }
}

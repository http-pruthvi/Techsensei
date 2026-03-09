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
        const { action, prompt, code, language = 'typescript' } = req.body || {};

        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let fullPrompt = '';
        if (action === 'generate') {
            fullPrompt = `Generate ${language} code for: "${prompt}". Provide ONLY the code without markdown backticks.`;
        } else if (action === 'refactor') {
            fullPrompt = `Refactor this ${language} code: ${code}. Provide ONLY the refactored code without markdown backticks.`;
        } else if (action === 'docs') {
            fullPrompt = `Document this ${language} code: ${code}. Provide ONLY the documented code without markdown backticks.`;
        } else {
            return errorResponse(res, 'Invalid action', 400);
        }

        const result = await model.generateContent(fullPrompt);
        const resultText = result.response.text().replace(/```\w*\n|\n```/g, '').trim();

        return successResponse(res, { code: resultText });
    } catch (error: unknown) {
        console.error('Copilot Error:', error);
        return errorResponse(res, (error as Error).message || 'Internal Server Error');
    }
}

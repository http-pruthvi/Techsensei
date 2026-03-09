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
        const { message, history } = req.body || {};

        if (!message) {
            return errorResponse(res, 'Message is required', 400);
        }

        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const formattedHistory = Array.isArray(history) ? history.map((h: Record<string, unknown>) => ({
            role: h.role as string,
            parts: [{ text: h.parts as string }]
        })) : [];

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return successResponse(res, { response: text });
    } catch (error: unknown) {
        console.error('Chat Error:', error);
        return errorResponse(res, (error as Error).message || 'Internal Server Error');
    }
}

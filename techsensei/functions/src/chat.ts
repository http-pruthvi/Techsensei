import * as functions from 'firebase-functions/v1';
import { GoogleGenerativeAI } from '@google/generative-ai';


const getGenAI = () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    return new GoogleGenerativeAI(apiKey);
};

interface ChatRequest {
    message: string;
    history: { role: 'user' | 'model'; parts: string }[];
    userId: string;
}

export const chatWithSensei = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { message, history } = data as ChatRequest;

    if (!message) {
        throw new functions.https.HttpsError('invalid-argument', 'Message is required');
    }

    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.parts }]
            })),
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return {
            response: text
        };

    } catch (error: any) {
        console.error('Error in chat:', error);

        // Fallback for missing API key
        if (error.message.includes('GOOGLE_AI_API_KEY is not set') && process.env.FUNCTIONS_EMULATOR) {
            return {
                response: `I'm a simulated TechSensei. You said: "${message}". (Add valid API key to see real AI responses)`
            };
        }

        throw new functions.https.HttpsError('internal', 'Failed to generate chat response');
    }
});

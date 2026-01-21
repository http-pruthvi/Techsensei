"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithSensei = void 0;
const functions = require("firebase-functions/v1");
const generative_ai_1 = require("@google/generative-ai");
const getGenAI = () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    return new generative_ai_1.GoogleGenerativeAI(apiKey);
};
exports.chatWithSensei = functions.https.onCall(async (data, context) => {
    if (!(context === null || context === void 0 ? void 0 : context.auth)) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { message, history } = data;
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
    }
    catch (error) {
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
//# sourceMappingURL=chat.js.map
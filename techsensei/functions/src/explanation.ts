import * as functions from 'firebase-functions/v1';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Note: We access the key from process.env which is populated by Firebase functions config
const getGenAI = () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    return new GoogleGenerativeAI(apiKey);
};

interface ExplanationRequest {
    topic: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    preference: 'visual' | 'textual' | 'mixed';
    context?: string;
}

export const generateExplanation = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    const requestData = data as ExplanationRequest;
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { topic, level, preference, context: userContext } = requestData;

    if (!topic) {
        throw new functions.https.HttpsError('invalid-argument', 'Topic is required');
    }

    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an expert technical teacher named TechSensei. 
      Your goal is to explain the concept of "${topic}" to a student.
      
      Parameters:
      - Level: ${level} (Adjust complexity and terminology accordingly)
      - Preference: ${preference} (Focus on ${preference === 'visual' ? 'diagrams/flowcharts (using mermaid syntax)' : 'clear text descriptions'})
      ${userContext ? `- Context: ${userContext}` : ''}

      Structure the response in JSON format with the following schema:
      {
        "content": "The main explanation in Markdown format. Use simple language for beginners. If visual is preferred, include mermaid diagrams wrapped in \`\`\`mermaid blocks.",
        "estimatedReadTime": number (in minutes),
        "relatedConcepts": ["concept1", "concept2", ...],
        "practicalApplications": ["application1", "application2", ...],
        "difficulty": number (1-10 scale)
      }

      Ensure the "content" field is rich, engaging, and directly addresses the topic.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if the model wrapped the JSON in them
        const jsonString = text.replace(/```json\n|\n```/g, '').trim();

        try {
            const parsedResponse = JSON.parse(jsonString);
            return parsedResponse;
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);
            throw new functions.https.HttpsError('internal', 'Failed to generate a valid explanation format');
        }

    } catch (error: any) {
        console.error('Error generating explanation:', error);

        // Fallback for missing API key in dev
        if (error.message.includes('GOOGLE_AI_API_KEY is not set') && process.env.FUNCTIONS_EMULATOR) {
            return {
                content: `Set your GOOGLE_AI_API_KEY to see real AI results!\n\n**Mock Explanation for ${topic}** (${level}):\nThis is a placeholder response because the API key is missing in your local environment.`,
                estimatedReadTime: 1,
                relatedConcepts: ['API Configuration', 'Environment Variables'],
                practicalApplications: ['Testing', 'Development'],
                difficulty: 1
            };
        }

        throw new functions.https.HttpsError('internal', error.message || 'Failed to generate explanation');
    }
});

export const simplifyConcept = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { text, level = 'beginner' } = data;

    if (!text) {
        throw new functions.https.HttpsError('invalid-argument', 'Text to simplify is required');
    }

    try {
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

        // Clean up markdown code blocks if the model wrapped the JSON in them
        const jsonString = resultText.replace(/```json\n|\n```/g, '').trim();

        try {
            return JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse AI response:', resultText);
            // Attempt to return raw text if JSON parsing fails
            return {
                simplifiedText: resultText,
                keyPoints: [],
                analogy: "Could not format as structured data."
            };
        }

    } catch (error: any) {
        console.error('Error simplifying text:', error);

        if (error.message.includes('GOOGLE_AI_API_KEY is not set') && process.env.FUNCTIONS_EMULATOR) {
            return {
                simplifiedText: `[MOCK] Simplified version of: "${text.substring(0, 50)}..."\n\n(Set API Key for real results)`,
                keyPoints: ["Mock point 1", "Mock point 2"],
                analogy: "Like a mock server returning a mock response."
            };
        }

        throw new functions.https.HttpsError('internal', 'Failed to simplify text');
    }
});

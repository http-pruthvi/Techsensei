import * as functions from 'firebase-functions/v1';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAI = () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    return new GoogleGenerativeAI(apiKey);
};

export const analyzeRepository = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { repoUrl } = data;

    if (!repoUrl) {
        throw new functions.https.HttpsError('invalid-argument', 'Repository URL is required');
    }

    // Basic validation for GitHub URL
    if (!repoUrl.includes('github.com')) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid GitHub URL');
    }

    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // In a real scenario, we would fetch the file tree and README content here.
        // For this MVP, we will ask the AI to "simulate" the analysis based on its training data 
        // regarding public repositories, or infer from the name if it's hypothetical.
        // If we had a GitHub Token, we would use the GitHub API to get the actual file structure.

        const prompt = `
      You are an expert Senior Software Architect.
      Your task is to analyze the GitHub repository at: "${repoUrl}".
      
      Since you cannot browse the live web, use your internal knowledge about this repository (if it's a popular public one) 
      or infer the likely structure and stack based on standard practices for a repository with this name/context.
      
      If it seems to be a "Hello World" or unknown repo, make a best-guess analysis for a standard project of that type (e.g., if it says "react-app", assume standard React structure).

      Provide the analysis in the following JSON format:
      {
        "overview": "Brief summary of what the project does.",
        "languages": [
           { "name": "LanguageName", "percentage": number, "color": "hexColor" }
        ],
        "architecture": "Description of the architectural pattern (e.g., MVC, Microservices, Monorepo)",
        "complexity": {
           "score": number (1-10),
           "reasoning": "Why this score?"
        },
        "recommendations": ["Rec 1", "Rec 2", "Rec 3"]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonString = text.replace(/```json\n|\n```/g, '').trim();

        try {
            return JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);
            throw new functions.https.HttpsError('internal', 'Failed to parse analysis results');
        }

    } catch (error: any) {
        console.error('Error analyzing repo:', error);

        if (error.message.includes('GOOGLE_AI_API_KEY is not set') && process.env.FUNCTIONS_EMULATOR) {
            return {
                overview: `[MOCK] Simulated analysis for ${repoUrl}`,
                languages: [
                    { name: 'TypeScript', percentage: 60, color: '#3178c6' },
                    { name: 'JavaScript', percentage: 30, color: '#f1e05a' },
                    { name: 'CSS', percentage: 10, color: '#563d7c' }
                ],
                architecture: 'Monolithic Frontend',
                complexity: {
                    score: 5,
                    reasoning: "Standard modern web application structure."
                },
                recommendations: ["Add CI/CD pipelines", "Improve test coverage"]
            };
        }

        throw new functions.https.HttpsError('internal', 'Analysis failed');
    }
});

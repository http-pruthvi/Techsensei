import * as functions from 'firebase-functions/v1';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAI = () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    return new GoogleGenerativeAI(apiKey);
};

export const generateCode = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { prompt, language = 'typescript' } = data;

    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const fullPrompt = `
      You are an expert software engineer.
      Generate ${language} code for the following request:
      "${prompt}"
      
      Provide ONLY the code, without markdown formatting or backticks.
      Ensure the code is clean, efficient, and well-commented.
    `;

        const result = await model.generateContent(fullPrompt);
        const code = result.response.text().replace(/```\w*\n|\n```/g, '').trim();

        return { code };
    } catch (error) {
        console.error('Generate code error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate code');
    }
});

export const refactorCode = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { code, language = 'typescript' } = data;

    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const fullPrompt = `
      You are an expert software engineer.
      Refactor the following ${language} code to use best practices, improve readability, and optimize performance.
      
      Code:
      ${code}
      
      Provide ONLY the refactored code, without markdown formatting or backticks.
    `;

        const result = await model.generateContent(fullPrompt);
        const refactoredCode = result.response.text().replace(/```\w*\n|\n```/g, '').trim();

        return { code: refactoredCode };
    } catch (error) {
        console.error('Refactor code error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to refactor code');
    }
});

export const generateDocs = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { code, language = 'typescript' } = data;

    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const fullPrompt = `
      You are an expert technical writer.
      Write comprehensive documentation (JSDoc or equivalent) for the following ${language} code.
      Return the code WITH the documentation comments added.
      
      Code:
      ${code}
      
      Provide ONLY the documented code, without markdown formatting or backticks.
    `;

        const result = await model.generateContent(fullPrompt);
        const documentedCode = result.response.text().replace(/```\w*\n|\n```/g, '').trim();

        return { code: documentedCode };
    } catch (error) {
        console.error('Generate docs error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate documentation');
    }
});

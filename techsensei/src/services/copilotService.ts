import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

interface CodeRequest {
    prompt?: string;
    code?: string;
    language?: string;
}

interface CodeResponse {
    code: string;
}

export const generateCode = async (prompt: string, language: string = 'typescript'): Promise<string> => {
    const call = httpsCallable<CodeRequest, CodeResponse>(functions, 'generateCode');
    const result = await call({ prompt, language });
    return result.data.code;
};

export const refactorCode = async (code: string, language: string = 'typescript'): Promise<string> => {
    const call = httpsCallable<CodeRequest, CodeResponse>(functions, 'refactorCode');
    const result = await call({ code, language });
    return result.data.code;
};

export const generateDocs = async (code: string, language: string = 'typescript'): Promise<string> => {
    const call = httpsCallable<CodeRequest, CodeResponse>(functions, 'generateDocs');
    const result = await call({ code, language });
    return result.data.code;
};

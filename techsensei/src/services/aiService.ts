import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

interface SimplificationRequest {
    text: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SimplificationResponse {
    simplifiedText: string;
    keyPoints: string[];
    analogy: string;
}

interface ChatRequest {
    message: string;
    history: { role: 'user' | 'model'; parts: string }[];
    userId: string;
}

interface ChatResponse {
    response: string;
}

export const simplifyText = async (data: SimplificationRequest): Promise<SimplificationResponse> => {
    try {
        const simplify = httpsCallable<SimplificationRequest, SimplificationResponse>(
            functions,
            'simplifyConcept'
        );
        const result = await simplify(data);
        return result.data;
    } catch (error) {
        console.error('Error simplifying text:', error);
        throw error;
    }
};

export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
    try {
        const chat = httpsCallable<ChatRequest, ChatResponse>(
            functions,
            'chatWithSensei'
        );
        const result = await chat(data);
        return result.data;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

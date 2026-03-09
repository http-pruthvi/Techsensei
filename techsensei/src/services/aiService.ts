import { auth } from '../lib/firebase';

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

const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    const token = await user.getIdToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const simplifyText = async (data: SimplificationRequest): Promise<SimplificationResponse> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch('/api/explanation', {
            method: 'POST',
            headers,
            body: JSON.stringify({ action: 'simplify', ...data })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to simplify text');
        }

        return await response.json();
    } catch (error) {
        console.error('Error simplifying text:', error);
        throw error;
    }
};

export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send chat message');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

import { auth } from '../lib/firebase';

const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    const token = await user.getIdToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const generateCode = async (prompt: string, language: string = 'typescript'): Promise<string> => {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/copilot', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'generate', prompt, language })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate code');
    }

    const data = await response.json();
    return data.code;
};

export const refactorCode = async (code: string, language: string = 'typescript'): Promise<string> => {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/copilot', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'refactor', code, language })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to refactor code');
    }

    const data = await response.json();
    return data.code;
};

export const generateDocs = async (code: string, language: string = 'typescript'): Promise<string> => {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/copilot', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'docs', code, language })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate documentation');
    }

    const data = await response.json();
    return data.code;
};

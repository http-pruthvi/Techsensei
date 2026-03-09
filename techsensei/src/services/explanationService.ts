import { auth } from '../lib/firebase';
import type { ExplanationRequest, ExplanationResponse } from '../types';

const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    const token = await user.getIdToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const requestExplanation = async (request: ExplanationRequest): Promise<ExplanationResponse> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch('/api/explanation', {
            method: 'POST',
            headers,
            body: JSON.stringify({ action: 'generate', ...request })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate explanation');
        }

        return await response.json();
    } catch (error) {
        console.error('Error requesting explanation:', error);
        throw error;
    }
};

export const submitFeedback = async (feedback: Omit<import('../types').ExplanationFeedback, 'id' | 'createdAt'>): Promise<void> => {
    try {
        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');

        await addDoc(collection(db, 'explanation_feedback'), {
            ...feedback,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error;
    }
};

import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import type { ExplanationRequest, ExplanationResponse } from '../types';

export const requestExplanation = async (request: ExplanationRequest): Promise<ExplanationResponse> => {
    try {
        const generateExplanation = httpsCallable<ExplanationRequest, ExplanationResponse>(
            functions,
            'generateExplanation'
        );

        const response = await generateExplanation(request);
        return response.data;
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

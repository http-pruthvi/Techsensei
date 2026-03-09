import { auth } from '../lib/firebase';
import type { LearningRoadmap } from '../types';

interface CreateRoadmapRequest {
    topic: string;
    level: string;
    goal?: string;
    duration?: string;
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

export const createRoadmap = async (data: CreateRoadmapRequest): Promise<LearningRoadmap> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch('/api/roadmap', {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create roadmap');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating roadmap:', error);
        throw error;
    }
};

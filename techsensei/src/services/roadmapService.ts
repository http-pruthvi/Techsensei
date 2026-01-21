import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import type { LearningRoadmap } from '../types';

interface CreateRoadmapRequest {
    topic: string;
    level: string;
    goal?: string;
    duration?: string;
}

export const createRoadmap = async (data: CreateRoadmapRequest): Promise<LearningRoadmap> => {
    try {
        const generate = httpsCallable<CreateRoadmapRequest, LearningRoadmap>(
            functions,
            'generateRoadmap'
        );
        const result = await generate(data);
        return result.data;
    } catch (error) {
        console.error('Error creating roadmap:', error);
        throw error;
    }
};

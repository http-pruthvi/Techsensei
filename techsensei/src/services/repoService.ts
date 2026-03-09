import { auth } from '../lib/firebase';

export interface RepoAnalysisResult {
    overview: string;
    languages: { name: string; percentage: number; color: string }[];
    architecture: string;
    complexity: {
        score: number;
        reasoning: string;
    };
    recommendations: string[];
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

export const analyzeRepository = async (repoUrl: string): Promise<RepoAnalysisResult> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch('/api/analysis', {
            method: 'POST',
            headers,
            body: JSON.stringify({ repoUrl })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to analyze repository');
        }

        return await response.json();
    } catch (error) {
        console.error('Error analyzing repo:', error);
        throw error;
    }
};

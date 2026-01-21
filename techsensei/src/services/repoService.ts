import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

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

interface AnalyzeRepoRequest {
    repoUrl: string;
}

export const analyzeRepository = async (repoUrl: string): Promise<RepoAnalysisResult> => {
    try {
        const analyze = httpsCallable<AnalyzeRepoRequest, RepoAnalysisResult>(
            functions,
            'analyzeRepository'
        );
        const result = await analyze({ repoUrl });
        return result.data;
    } catch (error) {
        console.error('Error analyzing repo:', error);
        throw error;
    }
};

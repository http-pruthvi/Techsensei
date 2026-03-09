import { auth } from '../lib/firebase';
import type { SearchResult, KnowledgeItem, SearchFilters } from '../types';


interface SaveRequest {
    title: string;
    content: string;
    type: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
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

export const searchKnowledge = async (query: string, filters?: SearchFilters): Promise<SearchResult[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch('/api/knowledge', {
            method: 'POST',
            headers,
            body: JSON.stringify({ action: 'search', query, filters })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Search failed');
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
};

export const saveKnowledgeItem = async (data: SaveRequest): Promise<KnowledgeItem> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch('/api/knowledge', {
            method: 'POST',
            headers,
            body: JSON.stringify({ action: 'save', item: data })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save knowledge item');
        }

        return await response.json();
    } catch (error) {
        console.error('Save error:', error);
        throw error;
    }
};

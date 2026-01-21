import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import type { SearchResult, KnowledgeItem, SearchFilters } from '../types';

interface SearchRequest {
    query: string;
    filters?: SearchFilters;
}

interface SaveRequest {
    title: string;
    content: string;
    type: string;
    tags?: string[];
    metadata?: any;
}

export const searchKnowledge = async (query: string, filters?: SearchFilters): Promise<SearchResult[]> => {
    try {
        const search = httpsCallable<SearchRequest, { results: SearchResult[] }>(
            functions,
            'searchKnowledge'
        );
        const result = await search({ query, filters });
        return result.data.results;
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
};

export const saveKnowledgeItem = async (data: SaveRequest): Promise<KnowledgeItem> => {
    try {
        const save = httpsCallable<SaveRequest, KnowledgeItem>(
            functions,
            'saveKnowledgeItem'
        );
        const result = await save(data);
        return result.data;
    } catch (error) {
        console.error('Save error:', error);
        throw error;
    }
};

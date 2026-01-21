import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Search, BookOpen } from 'lucide-react';
import { searchKnowledge } from '../services/knowledgeService';
import { KnowledgeCard } from '../components/knowledge/KnowledgeCard';
import type { SearchResult } from '../types';

const Knowledge: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'explanation' | 'code_analysis'>('all');

    // Initial load
    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const data = await searchKnowledge(query, {
                type: activeFilter === 'all' ? undefined : [activeFilter]
            });
            setResults(data);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <BookOpen className="text-green-500" /> Knowledge Vault
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Your personal library of simplified concepts and saved insights.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            value={query}
                            onChange={setQuery}
                            placeholder="Search your knowledge base..."
                            className="pl-10 w-full"
                        />
                    </form>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={activeFilter === 'all' ? 'primary' : 'outline'}
                        onClick={() => setActiveFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={activeFilter === 'explanation' ? 'primary' : 'outline'}
                        onClick={() => setActiveFilter('explanation')}
                    >
                        Explanations
                    </Button>
                    <Button
                        variant={activeFilter === 'code_analysis' ? 'primary' : 'outline'}
                        onClick={() => setActiveFilter('code_analysis')}
                    >
                        Code
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    // Skeleton loading
                    Array(3).fill(0).map((_, i) => (
                        <Card key={i} className="animate-pulse h-48 bg-gray-100 dark:bg-gray-800" >
                            <div className="h-full"></div>
                        </Card>
                    ))
                ) : results.length > 0 ? (
                    results.map((result) => (
                        <KnowledgeCard key={result.item.id} result={result} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No items found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {query ? `No match for "${query}"` : "Your vault is empty. Save explanations to see them here."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Knowledge;

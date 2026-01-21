import React from 'react';
import type { SearchResult } from '../../types';
import { Card } from '../ui';
import { FileText, Code, Map, BookOpen, Clock, Tag } from 'lucide-react';

interface KnowledgeCardProps {
    result: SearchResult;
    onClick?: () => void;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ result, onClick }) => {
    const { item } = result;

    const getIcon = () => {
        switch (item.type) {
            case 'code_analysis': return <Code size={20} className="text-blue-500" />;
            case 'roadmap': return <Map size={20} className="text-purple-500" />;
            case 'explanation': return <BookOpen size={20} className="text-green-500" />;
            default: return <FileText size={20} className="text-gray-500" />;
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
            <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-2">
                            {item.title}
                        </h3>
                        {result.relevanceScore > 3 && (
                            <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                                Match
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {result.contextSnippet || item.content}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                        {item.tags && item.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                                <Tag size={12} />
                                {item.tags.slice(0, 2).join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

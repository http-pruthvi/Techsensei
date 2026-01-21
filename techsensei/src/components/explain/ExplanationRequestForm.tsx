import React, { useState } from 'react';
import { Button, Input, Card } from '../ui';
import type { ExplanationRequest, LearningLevel, ContentPreference } from '../../types';

interface ExplanationRequestFormProps {
    onSubmit: (request: Omit<ExplanationRequest, 'userId'>) => void;
    loading: boolean;
}

export const ExplanationRequestForm: React.FC<ExplanationRequestFormProps> = ({ onSubmit, loading }) => {
    const [topic, setTopic] = useState('');
    const [context, setContext] = useState('');
    const [level, setLevel] = useState<LearningLevel>('beginner');
    const [preference, setPreference] = useState<ContentPreference>('mixed');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        onSubmit({
            topic,
            context,
            level,
            preference
        });
    };

    return (
        <Card className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Ask TechSensei</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Get personalized explanations powered by AI.
                    </p>
                </div>

                <Input
                    label="Topic to Explain"
                    placeholder="Enter the concept you want to understand (e.g. Recursion, React Hooks)..."
                    value={topic}
                    onChange={setTopic}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Additional Context (Optional)
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        rows={3}
                        placeholder="e.g. I know Java but I'm new to TypeScript..."
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Level
                        </label>
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            {(['beginner', 'intermediate', 'advanced'] as const).map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLevel(l)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${level === l
                                        ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Explanation Style
                        </label>
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            {(['visual', 'textual', 'mixed'] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPreference(p)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${preference === p
                                        ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                    Explain It To Me
                </Button>
            </form>
        </Card>
    );
};

import React, { useState } from 'react';
import { Button, Card } from '../ui';
import { ArrowRight } from 'lucide-react';

interface SimplificationFormProps {
    onSubmit: (text: string, level: 'beginner' | 'intermediate' | 'advanced') => void;
    loading: boolean;
}

export const SimplificationForm: React.FC<SimplificationFormProps> = ({ onSubmit, loading }) => {
    const [text, setText] = useState('');
    const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text, level);
    };

    return (
        <Card className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Simplify Complex Text</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Paste technical jargon, documentation, or code comments below to get a simplified explanation.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Text to Simplify
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white min-h-[150px]"
                        placeholder="Paste text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target Level
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

                <Button type="submit" loading={loading} className="w-full flex items-center justify-center gap-2">
                    Simplify It <ArrowRight size={16} />
                </Button>
            </form>
        </Card>
    );
};

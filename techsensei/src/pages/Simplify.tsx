import React, { useState } from 'react';
import { SimplificationForm } from '../components/simplify/SimplificationForm';
import { simplifyText, type SimplificationResponse } from '../services/aiService';
import { Card } from '../components/ui';
import ReactMarkdown from 'react-markdown';
import { Lightbulb, BookOpen } from 'lucide-react';

const Simplify: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SimplificationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSimplify = async (text: string, level: 'beginner' | 'intermediate' | 'advanced') => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await simplifyText({ text, level });
            setResult(response);
        } catch (err: unknown) {
            console.error(err);
            setError((err as Error).message || 'Failed to simplify text. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Lightbulb className="text-yellow-500" /> Simplify Concept
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Turn complex technical jargon into clear, easy-to-understand explanations.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <SimplificationForm onSubmit={handleSimplify} loading={loading} />

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="space-y-6 animate-slide-up">
                        <Card className="prose prose-blue dark:prose-invert max-w-none border-t-4 border-t-primary-500">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <BookOpen size={20} className="text-primary-500" /> Simplified Explanation
                            </h3>
                            <ReactMarkdown>{result.simplifiedText}</ReactMarkdown>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card title="Key Takeaways">
                                <ul className="space-y-2">
                                    {result.keyPoints.map((point, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                            <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-green-500 rounded-full" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card title="Simple Analogy">
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg italic text-gray-700 dark:text-gray-300 border-l-4 border-yellow-400">
                                    "{result.analogy}"
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Simplify;

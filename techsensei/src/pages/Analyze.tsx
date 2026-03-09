import React, { useState } from 'react';
import { analyzeRepository, type RepoAnalysisResult } from '../services/repoService';
import { Card, Button, Input } from '../components/ui';
import { Github, Code, Server, AlertCircle } from 'lucide-react';

const Analyze: React.FC = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RepoAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!repoUrl) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await analyzeRepository(repoUrl);
            setResult(data);
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to analyze repository');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Code className="text-purple-500" /> Repository Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Get an AI-powered architectural review of any public GitHub repository.
                </p>
            </div>

            <Card className="mb-8">
                <form onSubmit={handleAnalyze} className="flex gap-4 items-end">
                    <Input
                        label="GitHub Repository URL"
                        placeholder="https://github.com/username/repo"
                        value={repoUrl}
                        onChange={setRepoUrl}
                        className="flex-1"
                        required
                    />
                    <Button type="submit" loading={loading} className="mb-[2px]">
                        <Github className="mr-2" size={18} /> Analyze
                    </Button>
                </form>
            </Card>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* languages */}
                        <Card title="Languages" className="md:col-span-2">
                            <div className="space-y-4">
                                {result.languages.map((lang, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{lang.name}</span>
                                            <span className="text-gray-500">{lang.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="h-2.5 rounded-full"
                                                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Complexity Score */}
                        <Card title="Complexity">
                            <div className="flex flex-col items-center justify-center h-full py-4">
                                <div className={`text-5xl font-bold mb-2 ${result.complexity.score > 7 ? 'text-red-500' :
                                    result.complexity.score > 4 ? 'text-yellow-500' : 'text-green-500'
                                    }`}>
                                    {result.complexity.score}/10
                                </div>
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                    {result.complexity.reasoning}
                                </p>
                            </div>
                        </Card>
                    </div>

                    <Card title="Architecture Overview">
                        <div className="flex items-start gap-4">
                            <Server className="text-blue-500 mt-1" size={24} />
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{result.architecture}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {result.overview}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Recommendations">
                        <ul className="space-y-3">
                            {result.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                        {idx + 1}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Analyze;

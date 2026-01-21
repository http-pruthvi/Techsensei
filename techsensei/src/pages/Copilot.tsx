import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { Bot, Code, Zap, FileText, Copy, Check } from 'lucide-react';
import { generateCode, refactorCode, generateDocs } from '../services/copilotService';
import ReactMarkdown from 'react-markdown';

type Tab = 'generate' | 'refactor' | 'docs';

const Copilot: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('generate');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setOutput('');
        try {
            let result = '';
            if (activeTab === 'generate') {
                result = await generateCode(input);
            } else if (activeTab === 'refactor') {
                result = await refactorCode(input);
            } else if (activeTab === 'docs') {
                result = await generateDocs(input);
            }
            setOutput(result);
        } catch (error) {
            console.error(error);
            setOutput('Error generating response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <Bot className="text-indigo-600 dark:text-indigo-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productivity Copilot</h1>
                    <p className="text-gray-600 dark:text-gray-400">Your AI-powered coding assistant</p>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'generate'
                            ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Zap size={18} /> Generate Code
                    </button>
                    <button
                        onClick={() => setActiveTab('refactor')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'refactor'
                            ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Code size={18} /> Refactor
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'docs'
                            ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <FileText size={18} /> Documentation
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {activeTab === 'generate' ? 'Describe the code you want to generate:' : 'Paste your code here:'}
                            </label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-48 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y"
                                placeholder={
                                    activeTab === 'generate'
                                        ? "e.g., Create a React hook for handling dark mode..."
                                        : "// Paste code here..."
                                }
                                spellCheck={false}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" loading={loading} className="min-w-[120px]">
                                {activeTab === 'generate' ? 'Generate' : activeTab === 'refactor' ? 'Refactor' : 'Document'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>

            {output && (
                <div className="animate-slide-up">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Output</h3>
                        <button
                            onClick={handleCopy}
                            className="text-xs flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>
                    <Card className="bg-gray-900 text-gray-100 font-mono text-sm overflow-x-auto p-0">
                        <div className="p-4">
                            <ReactMarkdown components={{
                                code({ node, className, children, ...props }) {
                                    return <code className={className} {...props}>{children}</code>
                                }
                            }}>
                                {`\`\`\`typescript\n${output}\n\`\`\``}
                            </ReactMarkdown>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Copilot;

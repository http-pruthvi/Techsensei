import React, { useState } from 'react';
import { ExplanationRequestForm } from '../components/explain/ExplanationRequestForm';
import { ExplanationDisplay } from '../components/explain/ExplanationDisplay';
import { requestExplanation } from '../services/explanationService';
import { useAuth } from '../store/useAppStore';
import type { ExplanationRequest, ExplanationResponse } from '../types';

const Explain: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<ExplanationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRequest = async (requestData: Omit<ExplanationRequest, 'userId'>) => {
        if (!user) return;

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await requestExplanation({
                ...requestData,
                userId: user.id
            });
            setResponse(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to generate explanation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Concept Explainer</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Master complex technical topics with personalized AI explanations.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Request Form - Hide when response is shown to focus on content, or always show? 
                    Let's keep it visible but maybe minimized or just on top. 
                    For now, side-by-side or stacked. Stacked is better for mobile.
                */}
                <div className={`${response ? 'hidden md:block' : 'block'}`}>
                    <ExplanationRequestForm onSubmit={handleRequest} loading={loading} />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md">
                        {error}
                    </div>
                )}

                {response && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Explanation</h2>
                            <button
                                onClick={() => setResponse(null)}
                                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                            >
                                Ask Another Question
                            </button>
                        </div>
                        <ExplanationDisplay response={response} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explain;

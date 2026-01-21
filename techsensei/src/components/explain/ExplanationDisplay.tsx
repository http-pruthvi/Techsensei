
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, Button } from '../ui';
import type { ExplanationResponse } from '../../types';
import { submitFeedback } from '../../services/explanationService';
import { useAuth } from '../../hooks/useAuth';
import { Star } from 'lucide-react';

interface ExplanationDisplayProps {
    response: ExplanationResponse;
}

export const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ response }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    const handleSubmitFeedback = async () => {
        if (!user || rating === 0) return;

        setSubmitting(true);
        try {
            await submitFeedback({
                userId: user.id,
                topic: 'explanation_feedback', // We might want to pass the actual topic in props, but for now this is generic
                rating,
                comment,
                helpful: rating >= 4,
            });
            setFeedbackSubmitted(true);
        } catch (error) {
            console.error('Failed to submit feedback', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Main Content Card */}
            <Card className="prose prose-blue dark:prose-invert max-w-none">
                <div className="flex items-center justify-between mb-4 border-b pb-4 border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                            {response.estimatedReadTime} min read
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-purple-200 dark:text-purple-800">
                            Difficulty: {response.difficulty}/10
                        </span>
                    </div>
                </div>

                <ReactMarkdown>
                    {response.content}
                </ReactMarkdown>
            </Card>

            {/* Applications & Concepts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Practical Applications">
                    <ul className="space-y-2">
                        {response.practicalApplications.map((app, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-green-500 rounded-full" />
                                {app}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="Related Concepts">
                    <div className="flex flex-wrap gap-2">
                        {response.relatedConcepts.map((concept, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                            >
                                {concept}
                            </span>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Feedback Section */}
            {user && (
                <Card title="Was this explanation helpful?">
                    {feedbackSubmitted ? (
                        <div className="text-center py-4 text-green-600 dark:text-green-400">
                            Thank you for your feedback!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`p-1 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'}`}
                                    >
                                        <Star fill={rating >= star ? "currentColor" : "none"} size={24} />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                rows={3}
                                placeholder="Any additional comments? (Optional)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmitFeedback}
                                    disabled={rating === 0 || submitting}
                                    loading={submitting}
                                >
                                    Submit Feedback
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

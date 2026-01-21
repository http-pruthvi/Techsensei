import React from 'react';
import type { LearningRoadmap, LearningStep, LearningResource } from '../../types';
import { Card } from '../ui';
import { ExternalLink, Clock, Calendar } from 'lucide-react';

interface RoadmapViewProps {
    roadmap: LearningRoadmap;
    onStepComplete?: (stepId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">{roadmap.title}</h2>
                <p className="text-blue-100 mb-4">{roadmap.description}</p>

                <div className="flex gap-4 text-sm bg-white/10 p-3 rounded-lg inline-flex">
                    <span className="flex items-center gap-1">
                        <Clock size={16} /> {roadmap.estimatedDuration ? `${roadmap.estimatedDuration} weeks` : 'Self-paced'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={16} /> Created {new Date(roadmap.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>

                <div className="space-y-8 relative z-10">
                    {roadmap.steps.map((step: LearningStep, index: number) => (
                        <div key={step.id || index} className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm">
                                <span className="font-bold text-gray-500 dark:text-gray-400">{index + 1}</span>
                            </div>

                            <Card className="flex-1 transition-all hover:shadow-md border-l-4 border-l-primary-500">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{step.title}</h3>
                                    <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                        {step.estimatedTime} hours
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>

                                {step.resources && step.resources.length > 0 && (
                                    <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-md p-3">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recommended Resources</h4>
                                        <ul className="space-y-2">
                                            {step.resources.map((resource: LearningResource, idx: number) => (
                                                <li key={idx}>
                                                    <a
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline gap-2 group"
                                                    >
                                                        <ExternalLink size={14} className="group-hover:scale-110 transition-transform" />
                                                        {resource.title}
                                                        <span className="text-gray-400 ml-1 text-xs">({resource.type})</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <p className="text-sm text-gray-500 italic">
                    Finish all steps to unlock the next level!
                </p>
            </div>
        </div>
    );
};

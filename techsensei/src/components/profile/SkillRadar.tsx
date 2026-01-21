import React from 'react';
import type { Skill } from '../../types';
import { Card } from '../ui';

interface SkillRadarProps {
    skills: Skill[];
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ skills }) => {
    return (
        <Card className="h-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Skill Progress</h3>
            <div className="space-y-4">
                {skills.map((skill) => (
                    <div key={skill.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">Level {skill.level}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${skill.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
                {skills.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No skills tracked yet. Complete roadmaps to gain xp!</p>
                )}
            </div>
        </Card>
    );
};

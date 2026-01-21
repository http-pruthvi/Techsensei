import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Zap, Map } from 'lucide-react';
import { createRoadmap } from '../services/roadmapService';
import { RoadmapView } from '../components/learn/RoadmapView';
import type { LearningRoadmap } from '../types';

const Learn: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const result = await createRoadmap({
        topic,
        level,
        goal: `Master ${topic}`,
        duration: '4 weeks'
      });
      setRoadmap(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Map className="text-primary-500" /> Learning Paths
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate personalized roadmaps to master any skill.
          </p>
        </div>
      </div>

      {!roadmap && (
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleGenerateRoadmap} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create New Roadmap</h2>
              <p className="text-sm text-gray-500">Tell us what you want to learn</p>
            </div>

            <Input
              label="I want to learn..."
              placeholder="e.g., Python, React Native, Machine Learning"
              value={topic}
              onChange={setTopic}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">My current level</label>
              <div className="grid grid-cols-3 gap-3">
                {['beginner', 'intermediate', 'advanced'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`py-3 px-4 rounded-lg border-2 text-sm font-medium capitalize transition-all ${level === l
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full py-6 text-lg">
              Generate Roadmap <Zap size={20} className="ml-2" />
            </Button>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>
            )}
          </form>
        </Card>
      )}

      {roadmap && (
        <div className="animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={() => setRoadmap(null)}>
              ← Create New
            </Button>
          </div>
          <RoadmapView roadmap={roadmap} />
        </div>
      )}
    </div>
  );
};

export default Learn;
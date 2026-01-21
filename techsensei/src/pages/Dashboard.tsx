import React from 'react';
import { Card, Button } from '../components/ui';
import { 
  BookOpen, 
  Code, 
  Brain, 
  TrendingUp, 
  Clock, 
  Target,
  ChevronRight
} from 'lucide-react';
import { useAuth, useLearning, useRepository } from '../store/useAppStore';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentRoadmap, learningSession } = useLearning();
  const { currentRepository } = useRepository();

  const quickActions = [
    {
      title: 'Start Learning',
      description: 'Begin a new learning journey',
      icon: BookOpen,
      color: 'bg-blue-500',
      action: () => console.log('Start learning')
    },
    {
      title: 'Analyze Repository',
      description: 'Understand a codebase',
      icon: Code,
      color: 'bg-green-500',
      action: () => console.log('Analyze repo')
    },
    {
      title: 'Get Explanation',
      description: 'Explain complex concepts',
      icon: Brain,
      color: 'bg-purple-500',
      action: () => console.log('Get explanation')
    }
  ];

  const stats = [
    {
      label: 'Learning Streak',
      value: user?.progress.streakDays || 0,
      unit: 'days',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Total Time',
      value: Math.floor((user?.progress.totalLearningTime || 0) / 60),
      unit: 'hours',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: user?.progress.completedRoadmaps.length || 0,
      unit: 'roadmaps',
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">TS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to TechSensei
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your AI-powered learning companion for mastering technology. 
            Get personalized explanations, analyze codebases, and build skills faster.
          </p>
          <Button variant="primary" size="lg">
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.profile.displayName}!
        </h1>
        <p className="opacity-90">
          Ready to continue your learning journey? Let's build something amazing today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value} <span className="text-sm font-normal">{stat.unit}</span>
                  </p>
                </div>
                <Icon size={24} className={stat.color} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Current Activities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Learning */}
        <Card title="Continue Learning">
          {currentRoadmap ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {currentRoadmap.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentRoadmap.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Progress: Step {learningSession?.activities.length || 0} of {currentRoadmap.steps.length}
                </div>
                <Button variant="primary" size="sm">
                  Continue <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No active learning roadmap
              </p>
              <Button variant="outline" size="sm">
                Start Learning
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Analysis */}
        <Card title="Recent Analysis">
          {currentRepository ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {currentRepository.repoName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {currentRepository.owner}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {currentRepository.analysis.languages.length} languages detected
                </div>
                <Button variant="primary" size="sm">
                  View Analysis <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Code size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No recent repository analysis
              </p>
              <Button variant="outline" size="sm">
                Analyze Repository
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {action.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
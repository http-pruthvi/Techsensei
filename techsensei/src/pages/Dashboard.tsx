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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Welcome Section - Clean & Professional */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <span className="font-medium text-gray-900 dark:text-gray-200">{user?.profile.displayName}</span>. Here's your daily overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => console.log('View settings')}>
            Settings
          </Button>
        </div>
      </div>

      {/* Stats - Refined Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="flex items-center p-5 border-l-4 border-l-primary-500">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg mr-4">
                <Icon size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {stat.value} <span className="text-sm font-normal text-gray-400 ml-1">{stat.unit}</span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Active Work */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Learning */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-gray-500" /> Current Learning
              </h2>
              <Button variant="ghost" size="sm" className="text-primary-600">View All</Button>
            </div>

            <Card className="border-t-4 border-t-indigo-500">
              {currentRoadmap ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {currentRoadmap.title}
                      </h4>
                      <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded dark:bg-indigo-900/30 dark:text-indigo-300">
                        PROG: {Math.round((learningSession?.activities.length || 0) / currentRoadmap.steps.length * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {currentRoadmap.description}
                    </p>
                  </div>

                  {/* Professional Progress Bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((learningSession?.activities.length || 0) / currentRoadmap.steps.length * 100)}%` }}
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="primary" size="sm" className="shadow-md shadow-indigo-200 dark:shadow-none">
                      Continue Learning <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={32} className="text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-1">No active courses</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                    Start a new roadmap to track your progress and master new skills.
                  </p>
                  <Button variant="primary" onClick={() => console.log('Start')}>
                    Browse Roadmaps
                  </Button>
                </div>
              )}
            </Card>
          </section>

          {/* Recent Analysis Section - Condensed */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Code size={20} className="text-gray-500" /> Recent Activity
              </h2>
            </div>
            <Card>
              {currentRepository ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      <Code size={20} className="text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">{currentRepository.repoName}</h5>
                      <p className="text-xs text-gray-500">Analyzed {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Report</Button>
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-gray-500">No recent repositories analyzed</div>
              )}
            </Card>
          </section>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="group flex items-start space-x-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 text-left w-full"
                  >
                    <div className={`p-2 rounded-lg ${action.color.replace('bg-', 'bg-opacity-10 text-')}`}>
                      {/* Map color prop to text color roughly or hardcode for safety given Tailwind restrictions on dynamic class formulation without safelist */}
                      <Icon size={20} className={index === 0 ? "text-blue-600" : index === 1 ? "text-green-600" : "text-purple-600"} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                        {action.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {action.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
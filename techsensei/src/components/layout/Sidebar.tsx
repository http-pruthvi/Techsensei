import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  User,
  Brain,
  Code,
  Library,
  Lightbulb,
  Bot
} from 'lucide-react';
import { useUI } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  view: string;
  path: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    view: 'dashboard',
    path: '/dashboard',
    description: 'Overview and quick access'
  },
  {
    id: 'learn',
    label: 'Learn',
    icon: BookOpen,
    view: 'learn',
    path: '/learn',
    description: 'AI-powered learning paths'
  },
  {
    id: 'explain',
    label: 'Explain',
    icon: Brain,
    view: 'explain',
    path: '/explain',
    description: 'Get concepts explained'
  },
  {
    id: 'simplify',
    label: 'Simplify',
    icon: Lightbulb,
    view: 'simplify',
    path: '/simplify',
    description: 'Make it simple'
  },
  {
    id: 'assistant',
    label: 'Assistant',
    icon: Bot,
    view: 'assistant',
    path: '/assistant',
    description: 'AI Tutor Chat'
  },
  {
    id: 'analyze',
    label: 'Analyze Code',
    icon: Code,
    view: 'analyze',
    path: '/analyze',
    description: 'Repository analysis'
  },
  {
    id: 'copilot',
    label: 'Copilot',
    icon: Bot,
    view: 'copilot',
    path: '/copilot',
    description: 'AI Copilot assistance'
  },
  {
    id: 'knowledge',
    label: 'Knowledge Vault',
    icon: Library,
    view: 'knowledge',
    path: '/knowledge',
    description: 'Your learning library'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    view: 'profile',
    path: '/profile',
    description: 'Settings and progress'
  }
];

const Sidebar: React.FC = () => {
  const { sidebarOpen, currentView, setCurrentView } = useUI();
  const navigate = useNavigate();

  const handleNavigate = (view: string, path: string) => {
    setCurrentView(view);
    navigate(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setCurrentView(currentView)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          {/* Logo area for desktop */}
          <div className="hidden lg:flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TS</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              TechSensei
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.view, item.path)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-500'
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              TechSensei v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
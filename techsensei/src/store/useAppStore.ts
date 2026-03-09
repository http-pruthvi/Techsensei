import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  AppState,
  User,
  ThemePreference,
  LearningRoadmap,
  LearningSession,
  SearchResult,
  RepositoryAnalysis
} from '../types';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface AppStore extends AppState {
  // Additional internal state
  loading: boolean;
  error: string | null;

  // Additional actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  // Authentication state
  user: null,
  isAuthenticated: false,

  // UI state
  theme: 'system' as ThemePreference,
  sidebarOpen: true,
  currentView: 'dashboard' as const,

  // Learning state
  currentRoadmap: null,
  currentStep: 0,
  learningSession: null,

  // Knowledge state
  searchResults: [],
  selectedKnowledgeItem: null,

  // Repository analysis state
  currentRepository: null,
  analysisLoading: false,

  // Additional state
  loading: false,
  error: null,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Authentication actions
        setUser: (user: User | null) => {
          set({
            user,
            isAuthenticated: !!user
          }, false, 'setUser');
        },

        // UI actions
        setTheme: (theme: ThemePreference) => {
          set({ theme }, false, 'setTheme');

          // Apply theme to document
          const root = document.documentElement;
          if (theme === 'dark') {
            root.classList.add('dark');
          } else if (theme === 'light') {
            root.classList.remove('dark');
          } else {
            // System theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
              root.classList.add('dark');
            } else {
              root.classList.remove('dark');
            }
          }
        },

        toggleSidebar: () => {
          set((state) => ({
            sidebarOpen: !state.sidebarOpen
          }), false, 'toggleSidebar');
        },

        setCurrentView: (view: AppState['currentView']) => {
          set({
            currentView: view
          }, false, 'setCurrentView');
        },

        // Learning actions
        startLearningSession: (roadmap: LearningRoadmap) => {
          const session: LearningSession = {
            id: generateId(),
            userId: get().user?.id || '',
            roadmapId: roadmap.id,
            type: 'roadmap',
            startTime: new Date(),
            activities: [],
            summary: {
              conceptsCovered: [],
              skillsImproved: [],
              achievements: []
            }
          };

          set({
            currentRoadmap: roadmap,
            currentStep: 0,
            learningSession: session
          }, false, 'startLearningSession');
        },

        updateProgress: (stepIndex: number) => {
          const state = get();
          if (!state.learningSession) return;

          const updatedSession: LearningSession = {
            ...state.learningSession,
            activities: [
              ...state.learningSession.activities,
              {
                type: 'step_completed',
                timestamp: new Date(),
                data: { stepIndex }
              }
            ]
          };

          set({
            currentStep: stepIndex,
            learningSession: updatedSession
          }, false, 'updateProgress');
        },

        // Knowledge actions
        searchKnowledge: async (query: string) => {
          set({ loading: true, error: null }, false, 'searchKnowledge:start');

          try {
            // TODO: Implement actual search API call
            // For now, return mock results
            const mockResults: SearchResult[] = [
              {
                item: {
                  id: '1',
                  title: `Results for "${query}"`,
                  content: 'Mock search result content...',
                  type: 'explanation',
                  level: 'intermediate',
                  tags: ['search', 'mock'],
                  authorId: 'system',
                  metadata: {
                    relatedConcepts: [],
                    estimatedReadTime: 5,
                    difficulty: 3
                  },
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
                relevanceScore: 0.95,
                explanation: 'High relevance match',
                matchedConcepts: [query],
                contextSnippet: `This content matches your search for "${query}"`
              }
            ];

            set({
              searchResults: mockResults,
              loading: false
            }, false, 'searchKnowledge:success');
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Search failed',
              loading: false
            }, false, 'searchKnowledge:error');
          }
        },

        // Repository analysis actions
        analyzeRepository: async (repoUrl: string) => {
          set({
            analysisLoading: true,
            error: null
          }, false, 'analyzeRepository:start');

          try {
            // TODO: Implement actual repository analysis API call
            // For now, return mock analysis
            const mockAnalysis: RepositoryAnalysis = {
              id: generateId(),
              userId: get().user?.id || '',
              repoUrl,
              repoName: repoUrl.split('/').pop() || 'unknown',
              owner: repoUrl.split('/').slice(-2, -1)[0] || 'unknown',
              description: 'Mock repository analysis',
              analysis: {
                languages: [
                  { name: 'TypeScript', percentage: 65, files: ['src/main.ts'] },
                  { name: 'JavaScript', percentage: 25, files: ['config.js'] },
                  { name: 'CSS', percentage: 10, files: ['styles.css'] }
                ],
                frameworks: ['React', 'Vite'],
                architecture: 'Single Page Application',
                complexity: {
                  totalFiles: 50,
                  totalLines: 2500,
                  averageComplexity: 3.2,
                  score: 6,
                  factors: ['Moderate file count', 'Good separation of concerns'],
                  recommendations: ['Consider adding more tests', 'Improve documentation']
                },
                structure: {
                  directories: ['src', 'public', 'tests'],
                  entryPoints: ['src/main.ts'],
                  configFiles: ['vite.config.ts', 'package.json'],
                  keyFiles: ['src/App.tsx', 'src/main.ts']
                },
                dependencies: {
                  production: ['react', 'react-dom'],
                  development: ['vite', '@types/react'],
                  outdated: []
                },
                insights: {
                  strengths: ['Modern tooling', 'TypeScript usage'],
                  improvementAreas: ['Test coverage', 'Documentation'],
                  learningOpportunities: ['Advanced React patterns', 'Performance optimization']
                }
              },
              bookmarks: [],
              lastAnalyzed: new Date(),
              createdAt: new Date()
            };

            set({
              currentRepository: mockAnalysis,
              analysisLoading: false
            }, false, 'analyzeRepository:success');
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Analysis failed',
              analysisLoading: false
            }, false, 'analyzeRepository:error');
          }
        },

        // Utility actions
        setLoading: (loading: boolean) => {
          set({ loading }, false, 'setLoading');
        },

        setError: (error: string | null) => {
          set({ error }, false, 'setError');
        },

        clearError: () => {
          set({ error: null }, false, 'clearError');
        },

        reset: () => {
          set(initialState, false, 'reset');
        }
      }),
      {
        name: 'techsensei-store',
        partialize: (state) => ({
          // Only persist certain parts of the state
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    {
      name: 'TechSensei Store'
    }
  )
);

import { useShallow } from 'zustand/react/shallow';

// Selector hooks for better performance
export const useAuth = () => useAppStore(useShallow((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  setUser: state.setUser
})));

export const useTheme = () => useAppStore(useShallow((state) => ({
  theme: state.theme,
  setTheme: state.setTheme
})));

export const useUI = () => useAppStore(useShallow((state) => ({
  sidebarOpen: state.sidebarOpen,
  currentView: state.currentView,
  toggleSidebar: state.toggleSidebar,
  setCurrentView: state.setCurrentView
})));

export const useLearning = () => useAppStore(useShallow((state) => ({
  currentRoadmap: state.currentRoadmap,
  currentStep: state.currentStep,
  learningSession: state.learningSession,
  startLearningSession: state.startLearningSession,
  updateProgress: state.updateProgress
})));

export const useKnowledge = () => useAppStore(useShallow((state) => ({
  searchResults: state.searchResults,
  selectedKnowledgeItem: state.selectedKnowledgeItem,
  searchKnowledge: state.searchKnowledge
})));

export const useRepository = () => useAppStore(useShallow((state) => ({
  currentRepository: state.currentRepository,
  analysisLoading: state.analysisLoading,
  analyzeRepository: state.analyzeRepository
})));
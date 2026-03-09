// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  profile: UserProfile;
  preferences: UserPreferences;
  progress: LearningProgress;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  name: string;
  level: number;
  progress: number;
}

export interface UserProfile {
  displayName: string;
  avatar?: string;
  bio?: string;
  currentLevel: LearningLevel;
  skillAreas: SkillArea[];
  goals: LearningGoal[];
  // New unified properties
  xp?: number;
  level?: number;
  streak?: number;
  skills?: Skill[]; // Using the simple Skill interface for now
  achievements?: Achievement[];
}

export interface UserPreferences {
  contentPreference: ContentPreference;
  defaultLevel: LearningLevel;
  notificationSettings: NotificationSettings;
  themePreference: ThemePreference;
}

export interface LearningProgress {
  completedRoadmaps: string[];
  currentRoadmaps: ActiveRoadmap[];
  skillLevels: Record<string, number>;
  achievements: Achievement[];
  totalLearningTime: number;
  streakDays: number;
}

// Learning and Content Types
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentPreference = 'visual' | 'textual' | 'mixed';
export type ThemePreference = 'light' | 'dark' | 'system';
export type ContentType = 'explanation' | 'code_analysis' | 'summary' | 'note' | 'roadmap';

export interface SkillArea {
  id: string;
  name: string;
  category: string;
  level: number;
  progress: number;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
}

export interface ActiveRoadmap {
  roadmapId: string;
  currentStep: number;
  startedAt: Date;
  lastActivity: Date;
  timeSpent: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string; // Made optional to match usage
  unlockedAt?: Date;
  dateEarned?: string; // For compatibility
  category?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  learningReminders: boolean;
  weeklyProgress: boolean;
}

// Learning Content Types
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  level: LearningLevel;
  tags: string[];
  authorId: string;
  embedding?: number[];
  metadata: ContentMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentMetadata {
  source?: string;
  language?: string;
  framework?: string;
  relatedConcepts: string[];
  estimatedReadTime: number;
  difficulty: number;
}

export interface LearningRoadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: LearningLevel;
  estimatedDuration: number;
  steps: LearningStep[];
  prerequisites: string[];
  outcomes: string[];
  createdBy: string;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: 'concept' | 'practice' | 'project' | 'assessment';
  estimatedTime: number;
  content: string;
  resources: LearningResource[];
  validation: StepValidation;
  order: number;
}

export interface LearningResource {
  type: 'article' | 'video' | 'exercise' | 'project' | 'documentation';
  title: string;
  url?: string;
  content?: string;
  description?: string;
}

export interface StepValidation {
  criteria: string[];
  checkpoints: string[];
  autoValidation?: boolean;
}

export interface LearningSession {
  id: string;
  userId: string;
  roadmapId?: string;
  type: 'roadmap' | 'exploration' | 'code_analysis' | 'explanation';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  activities: SessionActivity[];
  summary: SessionSummary;
  feedback?: SessionFeedback;
}

export interface SessionActivity {
  type: string;
  timestamp: Date;
  data: unknown;
}

export interface SessionSummary {
  conceptsCovered: string[];
  skillsImproved: string[];
  achievements: string[];
}

export interface SessionFeedback {
  difficulty: number;
  usefulness: number;
  comments?: string;
}

// Repository Analysis Types
export interface RepositoryAnalysis {
  id: string;
  userId: string;
  repoUrl: string;
  repoName: string;
  owner: string;
  description?: string;
  analysis: RepoAnalysisData;
  bookmarks: CodeBookmark[];
  lastAnalyzed: Date;
  createdAt: Date;
}

export interface RepoAnalysisData {
  languages: LanguageInfo[];
  frameworks: string[];
  architecture: string;
  complexity: ComplexityMetrics;
  structure: ProjectStructure;
  dependencies: DependencyInfo;
  insights: AnalysisInsights;
}

export interface LanguageInfo {
  name: string;
  percentage: number;
  files: string[];
}

export interface ComplexityMetrics {
  totalFiles: number;
  totalLines: number;
  averageComplexity: number;
  score: number;
  factors: string[];
  recommendations: string[];
}

export interface ProjectStructure {
  directories: string[];
  entryPoints: string[];
  configFiles: string[];
  keyFiles: string[];
}

export interface DependencyInfo {
  production: string[];
  development: string[];
  outdated: string[];
}

export interface AnalysisInsights {
  strengths: string[];
  improvementAreas: string[];
  learningOpportunities: string[];
}

export interface CodeBookmark {
  id: string;
  filePath: string;
  lineNumber?: number;
  note: string;
  createdAt: Date;
}

// Search and Knowledge Types
export interface SearchResult {
  item: ContentItem;
  relevanceScore: number;
  explanation: string;
  matchedConcepts: string[];
  contextSnippet: string;
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  limit?: number;
}

export interface SearchFilters {
  type?: ContentType[];
  difficulty?: LearningLevel[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface KnowledgeItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: ContentType;
  tags: string[];
  category: string;
  difficulty: LearningLevel;
  vectorId?: string;
  metadata: ContentMetadata;
  createdAt: Date;
  updatedAt: Date;
  accessCount: number;
  lastAccessed: Date;
}

// API Response Types
export interface ExplanationRequest {
  topic: string;
  level: LearningLevel;
  preference: ContentPreference;
  context?: string;
  userId: string;
}

export interface ExplanationResponse {
  content: string;
  visualElements?: VisualElement[];
  relatedConcepts: string[];
  estimatedReadTime: number;
  difficulty: number;
  practicalApplications: string[];
}

export interface ExplanationFeedback {
  id?: string;
  userId: string;
  topic: string;
  rating: number; // 1-5
  comment?: string;
  helpful: boolean;
  createdAt: Date;
}

export interface VisualElement {
  type: 'diagram' | 'flowchart' | 'code' | 'image';
  content: string;
  caption?: string;
}

// UI State Types
export interface AppState {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;

  // UI state
  theme: ThemePreference;
  sidebarOpen: boolean;
  currentView: 'dashboard' | 'learn' | 'analyze' | 'knowledge' | 'profile';

  // Learning state
  currentRoadmap: LearningRoadmap | null;
  currentStep: number;
  learningSession: LearningSession | null;

  // Knowledge state
  searchResults: SearchResult[];
  selectedKnowledgeItem: KnowledgeItem | null;

  // Repository analysis state
  currentRepository: RepositoryAnalysis | null;
  analysisLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: ThemePreference) => void;
  toggleSidebar: () => void;
  setCurrentView: (view: 'dashboard' | 'learn' | 'analyze' | 'knowledge' | 'profile') => void;
  startLearningSession: (roadmap: LearningRoadmap) => void;
  updateProgress: (stepIndex: number) => void;
  searchKnowledge: (query: string) => Promise<void>;
  analyzeRepository: (repoUrl: string) => Promise<void>;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export interface ApiError extends AppError {
  status: number;
  endpoint: string;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'search';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

// Consolidated at the top
export interface Challenge {
  title: string;
  description: string;
  difficulty: LearningLevel;
  xpReward: number;
}

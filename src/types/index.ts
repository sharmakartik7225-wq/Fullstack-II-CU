export type PlatformType = 'Twitter' | 'LinkedIn' | 'Instagram' | 'Facebook' | 'DailyTask';
export type PostStatus = 'Draft' | 'Scheduled' | 'Published';
export type CalendarViewMode = 'month' | 'week';
export type ReminderRepeatType = 'daily' | 'weekdays' | 'weekends';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Homework' | 'Assignment' | 'DailyRoutine' | 'Project' | 'Study';

export interface Post {
  id: string;
  title: string;
  content: string;
  platform: PlatformType;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  status: PostStatus;
  colorTag: string; // hex or tailwind identifier
  mediaUrl?: string;
  tags?: string[];
  engagementEstimate?: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
  isRecurringDaily?: boolean;
  taskPriority?: TaskPriority;
  taskCategory?: TaskCategory;
  isCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyReminder {
  id: string;
  title: string;
  time: string; // HH:mm (e.g. "09:00")
  platforms: PlatformType[];
  repeatType: ReminderRepeatType;
  isActive: boolean;
  colorTag: string;
  notes?: string;
  taskCategory?: TaskCategory;
  createdAt: string;
}

export interface PlatformConfig {
  name: PlatformType;
  displayName: string;
  characterLimit: number;
  brandColor: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconName: string;
  handle: string;
  avatarUrl: string;
}

export interface FilterOptions {
  searchQuery: string;
  platforms: PlatformType[];
  statuses: PostStatus[];
  colorTag?: string;
  startDate?: string;
  endDate?: string;
}

export interface RenderEventLog {
  id: string;
  componentName: string;
  timestamp: number;
  renderCount: number;
  durationMs: number;
  reason: string;
  isWasted: boolean;
}

export interface BenchmarkResult {
  mode: 'optimized' | 'unoptimized';
  datasetSize: number;
  totalDurationMs: number;
  avgFrameTimeMs: number;
  minFrameTimeMs: number;
  maxFrameTimeMs: number;
  totalRerenders: number;
  wastedRerenders: number;
  fpsAverage: number;
  completedAt: string;
}

export interface PerformanceState {
  isOptimized: boolean;
  isReactMemoEnabled: boolean;
  isUseMemoEnabled: boolean;
  isUseCallbackEnabled: boolean;
  visualFlashingEnabled: boolean;
  cpuStressMs: number; // Simulated heavy blocking loop in ms
  showDiagnosticsHud: boolean;
  fps: number;
  lastRenderDuration: number;
  totalRenderCount: number;
  wastedRenderCount: number;
  recentRenderLogs: RenderEventLog[];
}

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks, format } from 'date-fns';
import { Post, CalendarViewMode, FilterOptions, PlatformType, PostStatus, DailyReminder } from '../types';
import { generateInitialPosts, generateBulkPosts } from '../utils/mockData';
import { usePerformance } from './PerformanceContext';

interface PostContextType {
  posts: Post[];
  filteredPosts: Post[];
  reminders: DailyReminder[];
  selectedDate: Date;
  viewMode: CalendarViewMode;
  filterOptions: FilterOptions;
  activePost: Post | null;
  isModalOpen: boolean;
  isAnalyticsOpen: boolean;
  isBenchmarkOpen: boolean;
  isWhyRenderOpen: boolean;
  isReminderModalOpen: boolean;
  draggedPostId: string | null;

  // Navigation
  setViewMode: (mode: CalendarViewMode) => void;
  setSelectedDate: (date: Date) => void;
  goToToday: () => void;
  goToNext: () => void;
  goToPrev: () => void;

  // Post Actions
  createPost: (newPostData: Omit<Post, 'id'>, scheduleRecurringDays?: number) => void;
  updatePost: (updatedPost: Post) => void;
  deletePost: (id: string) => void;
  duplicatePost: (id: string) => void;
  reschedulePost: (id: string, newDate: string, newTime?: string) => void;
  updatePostStatus: (id: string, status: PostStatus) => void;
  loadBulkData: (count: number) => void;
  resetToDefaultData: () => void;
  clearAllPosts: () => void;

  // Reminder Actions
  createReminder: (reminderData: Omit<DailyReminder, 'id' | 'createdAt'>) => void;
  updateReminder: (updatedReminder: DailyReminder) => void;
  deleteReminder: (id: string) => void;
  toggleReminderStatus: (id: string) => void;
  setIsReminderModalOpen: (open: boolean) => void;

  // Filter Actions
  setSearchQuery: (query: string) => void;
  togglePlatformFilter: (platform: PlatformType) => void;
  toggleStatusFilter: (status: PostStatus) => void;
  setColorTagFilter: (colorTag?: string) => void;
  resetFilters: () => void;

  // Modal Actions
  openCreateModal: (defaultDate?: string, defaultTime?: string) => void;
  openEditModal: (post: Post) => void;
  closeModal: () => void;
  setIsAnalyticsOpen: (open: boolean) => void;
  setIsBenchmarkOpen: (open: boolean) => void;
  setIsWhyRenderOpen: (open: boolean) => void;
  setDraggedPostId: (id: string | null) => void;
}

const PostContext = createContext<PostContextType | null>(null);

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  platforms: ['Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'DailyTask'],
  statuses: ['Draft', 'Scheduled', 'Published'],
  colorTag: undefined
};

const INITIAL_REMINDERS: DailyReminder[] = [
  {
    id: 'rem-1',
    title: '☀️ Morning Daily Tech Tip & Routine',
    time: '09:00',
    platforms: ['Twitter', 'LinkedIn'],
    repeatType: 'daily',
    isActive: true,
    colorTag: 'sky',
    notes: 'Share quick code snippets or architecture insights during morning peak.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rem-2',
    title: '💼 Midday Product Deep Dive & Article',
    time: '13:30',
    platforms: ['LinkedIn', 'Facebook'],
    repeatType: 'weekdays',
    isActive: true,
    colorTag: 'indigo',
    notes: 'Publish thought leadership article or engineering case study.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rem-3',
    title: '📚 Evening Homework & Assignment Submission Alert',
    time: '21:00',
    platforms: ['DailyTask'],
    repeatType: 'daily',
    isActive: true,
    colorTag: 'rose',
    notes: 'Verify lab reports, check course LMS deadlines, and submit homework before cutoff.',
    taskCategory: 'Homework',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rem-4',
    title: '🌆 Evening Community Spotlight & Poll',
    time: '18:00',
    platforms: ['Instagram', 'Twitter'],
    repeatType: 'daily',
    isActive: true,
    colorTag: 'purple',
    notes: 'Run an interactive developer poll or showcase open-source contributor work.',
    createdAt: new Date().toISOString()
  }
];

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => generateInitialPosts());
  const [reminders, setReminders] = useState<DailyReminder[]>(() => INITIAL_REMINDERS);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState<boolean>(false);
  const [isWhyRenderOpen, setIsWhyRenderOpen] = useState<boolean>(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  // Navigation handlers
  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const goToNext = useCallback(() => {
    setSelectedDate((prev) => (viewMode === 'month' ? addMonths(prev, 1) : addWeeks(prev, 1)));
  }, [viewMode]);

  const goToPrev = useCallback(() => {
    setSelectedDate((prev) => (viewMode === 'month' ? subMonths(prev, 1) : subWeeks(prev, 1)));
  }, [viewMode]);

  // CRUD Actions
  const createPost = useCallback((newPostData: Omit<Post, 'id'>, scheduleRecurringDays = 0) => {
    const baseId = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    if (scheduleRecurringDays > 0 && newPostData.scheduledDate) {
      // Generate recurring series of posts
      const generatedSeries: Post[] = [];
      const [year, month, day] = newPostData.scheduledDate.split('-').map(Number);
      const startDate = new Date(year, month - 1, day);

      for (let i = 0; i < scheduleRecurringDays; i++) {
        const nextD = new Date(startDate);
        nextD.setDate(startDate.getDate() + i);
        const dateStr = format(nextD, 'yyyy-MM-dd');

        generatedSeries.push({
          ...newPostData,
          id: `${baseId}-day-${i + 1}`,
          title: scheduleRecurringDays > 1 ? `${newPostData.title} (Day ${i + 1})` : newPostData.title,
          scheduledDate: dateStr,
          isRecurringDaily: true,
          createdAt: nowIso,
          updatedAt: nowIso
        });
      }

      setPosts((prev) => [...generatedSeries, ...prev]);
    } else {
      const newPost: Post = {
        ...newPostData,
        id: baseId,
        createdAt: nowIso,
        updatedAt: nowIso
      };
      setPosts((prev) => [newPost, ...prev]);
    }

    setIsModalOpen(false);
    setActivePost(null);
  }, []);

  const updatePost = useCallback((updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? { ...updatedPost, updatedAt: new Date().toISOString() } : p))
    );
    setIsModalOpen(false);
    setActivePost(null);
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (activePost?.id === id) {
      setIsModalOpen(false);
      setActivePost(null);
    }
  }, [activePost]);

  const duplicatePost = useCallback((id: string) => {
    setPosts((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) return prev;
      const duplicated: Post = {
        ...target,
        id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: `${target.title} (Copy)`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return [duplicated, ...prev];
    });
  }, []);

  const reschedulePost = useCallback((id: string, newDate: string, newTime?: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, scheduledDate: newDate, scheduledTime: newTime || p.scheduledTime, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const updatePostStatus = useCallback((id: string, status: PostStatus) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  // Daily Reminders CRUD
  const createReminder = useCallback((reminderData: Omit<DailyReminder, 'id' | 'createdAt'>) => {
    const newReminder: DailyReminder = {
      ...reminderData,
      id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    setReminders((prev) => [newReminder, ...prev]);
  }, []);

  const updateReminder = useCallback((updatedReminder: DailyReminder) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleReminderStatus = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  }, []);

  const loadBulkData = useCallback((count: number) => {
    setPosts(generateBulkPosts(count));
  }, []);

  const resetToDefaultData = useCallback(() => {
    setPosts(generateInitialPosts());
    setReminders(INITIAL_REMINDERS);
    setFilterOptions(DEFAULT_FILTERS);
  }, []);

  const clearAllPosts = useCallback(() => {
    setPosts([]);
  }, []);

  // Filter setters
  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilterOptions((prev) => ({ ...prev, searchQuery }));
  }, []);

  const togglePlatformFilter = useCallback((platform: PlatformType) => {
    setFilterOptions((prev) => {
      const exists = prev.platforms.includes(platform);
      const newPlatforms = exists
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms: newPlatforms.length === 0 ? [platform] : newPlatforms };
    });
  }, []);

  const toggleStatusFilter = useCallback((status: PostStatus) => {
    setFilterOptions((prev) => {
      const exists = prev.statuses.includes(status);
      const newStatuses = exists
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status];
      return { ...prev, statuses: newStatuses.length === 0 ? [status] : newStatuses };
    });
  }, []);

  const setColorTagFilter = useCallback((colorTag?: string) => {
    setFilterOptions((prev) => ({ ...prev, colorTag }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterOptions(DEFAULT_FILTERS);
  }, []);

  // Modal actions
  const openCreateModal = useCallback((defaultDate?: string, defaultTime?: string) => {
    const today = new Date();
    setActivePost({
      id: '',
      title: '',
      content: '',
      platform: 'Twitter',
      scheduledDate: defaultDate || format(today, 'yyyy-MM-dd'),
      scheduledTime: defaultTime || '09:00',
      status: 'Draft',
      colorTag: 'sky',
      tags: ['#WebDev']
    });
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((post: Post) => {
    setActivePost(post);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setActivePost(null);
  }, []);

  // Filter algorithm
  const executeFilterAlgorithm = (rawPosts: Post[], filters: FilterOptions): Post[] => {
    const query = filters.searchQuery.trim().toLowerCase();
    return rawPosts.filter((post) => {
      if (!filters.platforms.includes(post.platform)) return false;
      if (!filters.statuses.includes(post.status)) return false;
      if (filters.colorTag && post.colorTag !== filters.colorTag) return false;
      if (query) {
        const titleMatch = post.title.toLowerCase().includes(query);
        const contentMatch = post.content.toLowerCase().includes(query);
        const tagMatch = post.tags?.some((t) => t.toLowerCase().includes(query));
        return titleMatch || contentMatch || Boolean(tagMatch);
      }
      return true;
    });
  };

  const { isUseMemoEnabled } = usePerformance();

  const memoizedFilteredPosts = useMemo(() => {
    return executeFilterAlgorithm(posts, filterOptions);
  }, [posts, filterOptions]);

  const filteredPosts = isUseMemoEnabled
    ? memoizedFilteredPosts
    : executeFilterAlgorithm(posts, filterOptions);

  return (
    <PostContext.Provider
      value={{
        posts,
        filteredPosts,
        reminders,
        selectedDate,
        viewMode,
        filterOptions,
        activePost,
        isModalOpen,
        isAnalyticsOpen,
        isBenchmarkOpen,
        isWhyRenderOpen,
        isReminderModalOpen,
        draggedPostId,
        setViewMode,
        setSelectedDate,
        goToToday,
        goToNext,
        goToPrev,
        createPost,
        updatePost,
        deletePost,
        duplicatePost,
        reschedulePost,
        updatePostStatus,
        createReminder,
        updateReminder,
        deleteReminder,
        toggleReminderStatus,
        setIsReminderModalOpen,
        loadBulkData,
        resetToDefaultData,
        clearAllPosts,
        setSearchQuery,
        togglePlatformFilter,
        toggleStatusFilter,
        setColorTagFilter,
        resetFilters,
        openCreateModal,
        openEditModal,
        closeModal,
        setIsAnalyticsOpen,
        setIsBenchmarkOpen,
        setIsWhyRenderOpen,
        setDraggedPostId
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = (): PostContextType => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

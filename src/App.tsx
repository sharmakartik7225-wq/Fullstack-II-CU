import React, { Profiler } from 'react';
import { Navbar } from './components/Navbar';
import { PerformanceHUD } from './components/PerformanceHUD';
import { FilterBar } from './components/Filters/FilterBar';
import { CalendarHeader } from './components/Calendar/CalendarHeader';
import { MonthView } from './components/Calendar/MonthView';
import { WeekView } from './components/Calendar/WeekView';
import { PostModal } from './components/Post/PostModal';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { BenchmarkModal } from './components/Diagnostics/BenchmarkModal';
import { RenderWhyPanel } from './components/Diagnostics/RenderWhyPanel';
import { ReminderModal } from './components/Reminders/ReminderModal';
import { usePosts } from './context/PostContext';
import { usePerformance } from './context/PerformanceContext';

const MainCalendarContent: React.FC = () => {
  const { viewMode } = usePosts();
  const { onProfilerRender } = usePerformance();

  return (
    <Profiler id="SocialSchedulerViewport" onRender={onProfilerRender}>
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4 space-y-4">
        {/* Search & Filter Controls */}
        <FilterBar />

        {/* Calendar Navigation & Mode Switcher */}
        <CalendarHeader />

        {/* Active View Mode Grid */}
        <div className="transition-all duration-200">
          {viewMode === 'month' ? <MonthView /> : <WeekView />}
        </div>
      </main>
    </Profiler>
  );
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Application Bar */}
      <Navbar />

      {/* Live Telemetry & Performance HUD Bar */}
      <PerformanceHUD />

      {/* Main Content Area */}
      <div className="flex-1">
        <MainCalendarContent />
      </div>

      {/* Modals & Dialogs */}
      <PostModal />
      <ReminderModal />
      <AnalyticsView />
      <BenchmarkModal />
      <RenderWhyPanel />
    </div>
  );
};

export default App;

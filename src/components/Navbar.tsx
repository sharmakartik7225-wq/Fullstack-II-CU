import React from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Zap,
  Activity,
  BarChart3,
  Sparkles,
  Database,
  HelpCircle,
  Eye,
  Sliders,
  CheckCircle2,
  XCircle,
  Bell
} from 'lucide-react';
import { usePosts } from '../context/PostContext';
import { usePerformance } from '../context/PerformanceContext';

export const Navbar: React.FC = () => {
  const {
    openCreateModal,
    setIsAnalyticsOpen,
    setIsBenchmarkOpen,
    setIsWhyRenderOpen,
    isReminderModalOpen,
    setIsReminderModalOpen,
    reminders,
    loadBulkData,
    resetToDefaultData,
    posts
  } = usePosts();

  const {
    isOptimized,
    toggleOptimization,
    isReactMemoEnabled,
    toggleReactMemo,
    isUseMemoEnabled,
    toggleUseMemo,
    isUseCallbackEnabled,
    toggleUseCallback,
    visualFlashingEnabled,
    toggleVisualFlashing,
    cpuStressMs,
    setCpuStressMs
  } = usePerformance();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-3 lg:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base sm:text-lg text-white tracking-tight flex items-center gap-1.5">
                SocialPulse & Daily Planner <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">Exp 4</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
              Social Media, Homework & Daily Routine Task Scheduler
            </p>
          </div>
        </div>

        {/* Center: Dedicated Granular Optimization Buttons (React.memo, useMemo, useCallback) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          {/* React.memo Toggle Button */}
          <button
            onClick={toggleReactMemo}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-150 border ${
              isReactMemoEnabled
                ? 'bg-purple-950/80 text-purple-200 border-purple-500/50 shadow-sm shadow-purple-500/20 hover:bg-purple-900/80'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200 opacity-60'
            }`}
            title="Toggle React.memo component wrapper on CalendarCell, WeekTimeSlot, and PostCard"
          >
            <span className="font-bold font-sans">React.memo</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                isReactMemoEnabled ? 'bg-purple-500/30 text-purple-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isReactMemoEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* useMemo Toggle Button */}
          <button
            onClick={toggleUseMemo}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-150 border ${
              isUseMemoEnabled
                ? 'bg-sky-950/80 text-sky-200 border-sky-500/50 shadow-sm shadow-sky-500/20 hover:bg-sky-900/80'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200 opacity-60'
            }`}
            title="Toggle useMemo caching on post filtering, date grouping, and analytics calculations"
          >
            <span className="font-bold font-sans">useMemo</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                isUseMemoEnabled ? 'bg-sky-500/30 text-sky-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isUseMemoEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* useCallback Toggle Button */}
          <button
            onClick={toggleUseCallback}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-150 border ${
              isUseCallbackEnabled
                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/50 shadow-sm shadow-emerald-500/20 hover:bg-emerald-900/80'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200 opacity-60'
            }`}
            title="Toggle useCallback reference stability on event handlers and dispatchers"
          >
            <span className="font-bold font-sans">useCallback</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                isUseCallbackEnabled ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isUseCallbackEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          {/* Master All ON / All OFF Quick Switch */}
          <button
            onClick={toggleOptimization}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              isOptimized
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50'
                : 'bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/50'
            }`}
            title="Toggle all 3 optimizations together"
          >
            {isOptimized ? 'All ON' : 'Mixed / All OFF'}
          </button>

          {/* Render Flash Highlight Button */}
          <button
            onClick={toggleVisualFlashing}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              visualFlashingEnabled
                ? 'bg-slate-800 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-900 text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle visual re-render flashing highlight"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Artificial CPU Lag Dropdown */}
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs">
            <Sliders className="w-3 h-3 text-slate-400" />
            <select
              value={cpuStressMs}
              onChange={(e) => setCpuStressMs(Number(e.target.value))}
              className="bg-transparent text-[11px] text-slate-200 font-mono focus:outline-none cursor-pointer"
              title="Simulate synchronous CPU blocking calculations on each render"
            >
              <option value={0} className="bg-slate-900 text-slate-200">0ms Lag</option>
              <option value={5} className="bg-slate-900 text-slate-200">5ms Lag</option>
              <option value={15} className="bg-slate-900 text-slate-200">15ms Lag</option>
              <option value={30} className="bg-slate-900 text-slate-200">30ms Lag</option>
            </select>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Dataset Quick Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-300 border border-slate-700/60 transition-colors">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Posts ({posts.length})</span>
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 hidden group-hover:block z-50 animate-in fade-in duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800/80">
                Load Test Datasets
              </div>
              <button
                onClick={resetToDefaultData}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
              >
                <span>Default Preset</span>
                <span className="text-[10px] text-slate-500">10 posts</span>
              </button>
              <button
                onClick={() => loadBulkData(50)}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
              >
                <span>Medium Stress</span>
                <span className="text-[10px] text-amber-400">50 posts</span>
              </button>
              <button
                onClick={() => loadBulkData(200)}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
              >
                <span>Heavy Stress</span>
                <span className="text-[10px] text-rose-400 font-semibold">200 posts</span>
              </button>
              <button
                onClick={() => loadBulkData(500)}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
              >
                <span>Extreme Stress</span>
                <span className="text-[10px] text-purple-400 font-semibold">500 posts</span>
              </button>
            </div>
          </div>

          {/* Benchmark Button */}
          <button
            onClick={() => setIsBenchmarkOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
            title="Run Side-by-Side Performance Stress Benchmark"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Benchmark</span>
          </button>

          {/* Analytics Button */}
          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
            title="View Platform Analytics & Posting Cadence"
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Analytics</span>
          </button>

          {/* Why Render Diagnostics Button */}
          <button
            onClick={() => setIsWhyRenderOpen(true)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Inspect Re-render Logs & Why Components Render"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Daily Reminders Button */}
          <button
            onClick={() => setIsReminderModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-amber-300 border border-slate-700/60 hover:border-amber-500/40 transition-colors"
            title="Manage Daily Posting Reminders & Habit Schedule"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Reminders</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
              {reminders.filter((r) => r.isActive).length}
            </span>
          </button>

          {/* Create Post Button */}
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>
    </header>
  );
};

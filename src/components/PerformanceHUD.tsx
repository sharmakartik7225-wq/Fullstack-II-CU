import React from 'react';
import { Activity, Gauge, Flame, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { usePerformance } from '../context/PerformanceContext';

export const PerformanceHUD: React.FC = () => {
  const {
    isOptimized,
    isReactMemoEnabled,
    toggleReactMemo,
    isUseMemoEnabled,
    toggleUseMemo,
    isUseCallbackEnabled,
    toggleUseCallback,
    fps,
    lastRenderDuration,
    totalRenderCount,
    wastedRenderCount,
    clearRenderLogs,
    showDiagnosticsHud
  } = usePerformance();

  if (!showDiagnosticsHud) return null;

  const fpsColor =
    fps >= 55 ? 'text-emerald-400' : fps >= 35 ? 'text-amber-400' : 'text-rose-500 font-bold';
  const renderTimeColor =
    lastRenderDuration < 4
      ? 'text-emerald-400'
      : lastRenderDuration < 16
      ? 'text-amber-400'
      : 'text-rose-400 font-bold';

  const isPropThrashing = isReactMemoEnabled && !isUseCallbackEnabled;

  return (
    <div className="bg-slate-900/95 border-y border-slate-800 px-4 py-2 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Primitives Active Status */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-sans font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOptimized ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOptimized ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <span>Active Primitives:</span>
          </div>

          {/* React.memo Badge */}
          <button
            onClick={toggleReactMemo}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
              isReactMemoEnabled
                ? 'bg-purple-950 text-purple-300 border-purple-700/80 hover:bg-purple-900'
                : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Click to toggle React.memo"
          >
            React.memo: <strong className={isReactMemoEnabled ? 'text-purple-200' : 'text-slate-500'}>{isReactMemoEnabled ? 'ON' : 'OFF'}</strong>
          </button>

          {/* useMemo Badge */}
          <button
            onClick={toggleUseMemo}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
              isUseMemoEnabled
                ? 'bg-sky-950 text-sky-300 border-sky-700/80 hover:bg-sky-900'
                : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Click to toggle useMemo"
          >
            useMemo: <strong className={isUseMemoEnabled ? 'text-sky-200' : 'text-slate-500'}>{isUseMemoEnabled ? 'ON' : 'OFF'}</strong>
          </button>

          {/* useCallback Badge */}
          <button
            onClick={toggleUseCallback}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
              isUseCallbackEnabled
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900'
                : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Click to toggle useCallback"
          >
            useCallback: <strong className={isUseCallbackEnabled ? 'text-emerald-200' : 'text-slate-500'}>{isUseCallbackEnabled ? 'ON' : 'OFF'}</strong>
          </button>

          {/* Prop Thrashing Warning Pill if React.memo is ON but useCallback is OFF */}
          {isPropThrashing && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>Prop Thrashing Active (Memo broken by unmemoized callbacks)</span>
            </span>
          )}
        </div>

        {/* Center: Live Gauges */}
        <div className="flex items-center gap-4 text-slate-300">
          {/* Live FPS */}
          <div className="flex items-center gap-1.5" title="Frames Per Second measured via requestAnimationFrame">
            <Gauge className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">FPS:</span>
            <span className={`font-semibold ${fpsColor}`}>{fps}</span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          {/* Last Render Time */}
          <div className="flex items-center gap-1.5" title="React Profiler commit duration for the last render tree update">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Last Render:</span>
            <span className={`font-semibold ${renderTimeColor}`}>{lastRenderDuration}ms</span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          {/* Total Re-renders */}
          <div className="flex items-center gap-1.5" title="Total re-render executions recorded across calendar cells and post cards">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-400">Total Renders:</span>
            <span className="text-orange-300 font-semibold">{totalRenderCount}</span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          {/* Wasted Renders */}
          <div className="flex items-center gap-1.5" title="Rerenders where props did not change (avoided when React.memo is enabled)">
            {wastedRenderCount > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="text-slate-400">Wasted:</span>
            <span
              className={`font-semibold ${
                wastedRenderCount > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {wastedRenderCount}
            </span>
          </div>
        </div>

        {/* Right: Reset counters */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearRenderLogs}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset telemetry render counters and logs"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Counts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Filter,
  Flame,
  Search
} from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { usePerformance } from '../../context/PerformanceContext';

export const RenderWhyPanel: React.FC = () => {
  const { isWhyRenderOpen, setIsWhyRenderOpen } = usePosts();
  const {
    recentRenderLogs,
    clearRenderLogs,
    isOptimized,
    totalRenderCount,
    wastedRenderCount
  } = usePerformance();

  const [filterQuery, setFilterQuery] = useState('');
  const [onlyWasted, setOnlyWasted] = useState(false);

  if (!isWhyRenderOpen) return null;

  const filteredLogs = recentRenderLogs.filter((log) => {
    if (onlyWasted && !log.isWasted) return false;
    if (filterQuery) {
      return (
        log.componentName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.reason.toLowerCase().includes(filterQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                "Why Did This Render?" Diagnostics
              </h3>
              <p className="text-xs text-slate-400">
                Real-time component render reasons and wasted execution telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWhyRenderOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Total: <strong>{totalRenderCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400">
                Wasted: <strong>{wastedRenderCount}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={clearRenderLogs}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Logs</span>
          </button>
        </div>

        {/* Search & Filter Logs */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by component name or reason..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setOnlyWasted((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              onlyWasted
                ? 'bg-amber-950 text-amber-300 border-amber-700'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>Only Wasted</span>
          </button>
        </div>

        {/* Log Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No render events matching current filters.
              <br />
              <span className="text-slate-600 mt-1 inline-block">
                Interact with the calendar or search box to trigger render events.
              </span>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                  log.isWasted
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white font-sans">{log.componentName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {log.durationMs}ms
                    </span>
                    {log.isWasted ? (
                      <span className="px-1.5 py-0.2 text-[9px] rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Wasted Render
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 text-[9px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Valid State Change
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {log.reason}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
          <span>Active Optimization: <strong className="text-white">{isOptimized ? 'Enabled' : 'Disabled'}</strong></span>
          <button
            onClick={() => setIsWhyRenderOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

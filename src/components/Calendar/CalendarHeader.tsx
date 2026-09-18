import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Grid } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { usePosts } from '../../context/PostContext';
import { useRenderCounter } from '../../hooks/useRenderCounter';

export const CalendarHeader: React.FC = () => {
  const { selectedDate, viewMode, setViewMode, goToToday, goToNext, goToPrev } = usePosts();
  const { renderCount, elementRef } = useRenderCounter({ componentName: 'CalendarHeader' });

  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      return format(selectedDate, 'MMMM yyyy');
    } else {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 relative"
    >
      {/* Visual Render Counter */}
      <div className="absolute top-0 right-0 px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/60 text-[10px] font-mono text-slate-400">
        Renders: <span className="text-indigo-300 font-semibold">{renderCount}</span>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          {getHeaderTitle()}
        </h2>

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-sm">
          <button
            onClick={goToPrev}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Previous Period"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNext}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Next Period"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Mode Switcher (Month View vs Week View) */}
      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 self-start sm:self-auto shadow-sm">
        <button
          onClick={() => setViewMode('month')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'month'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Month View</span>
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'week'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Week / Time-Slot</span>
        </button>
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { getMonthGrid } from '../../utils/dateUtils';
import { CalendarCell } from './CalendarCell';
import { usePosts } from '../../context/PostContext';
import { usePerformance } from '../../context/PerformanceContext';
import { useRenderCounter } from '../../hooks/useRenderCounter';
import { Post } from '../../types';

export const MonthView: React.FC = () => {
  const { selectedDate, filteredPosts } = usePosts();
  const { isUseMemoEnabled } = usePerformance();
  const { renderCount, elementRef } = useRenderCounter({ componentName: 'MonthView' });

  const weekDayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate month grid days
  const monthDays = useMemo(() => {
    return getMonthGrid(selectedDate);
  }, [selectedDate]);

  // Group filtered posts by date
  // In useMemo mode: useMemo ensures grouping only runs when filteredPosts changes
  // In unmemoized mode: runs synchronously on every render
  const memoizedPostsByDate = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of filteredPosts) {
      const existing = map.get(post.scheduledDate) || [];
      existing.push(post);
      map.set(post.scheduledDate, existing);
    }
    return map;
  }, [filteredPosts]);

  const unmemoizedPostsByDate = () => {
    const map = new Map<string, Post[]>();
    for (const post of filteredPosts) {
      const existing = map.get(post.scheduledDate) || [];
      existing.push(post);
      map.set(post.scheduledDate, existing);
    }
    return map;
  };

  const postsByDateMap = isUseMemoEnabled ? memoizedPostsByDate : unmemoizedPostsByDate();

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-3 sm:p-4 shadow-md relative"
    >
      {/* Weekday column headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDayHeaders.map((dayName, idx) => (
          <div
            key={dayName}
            className={`text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-lg ${
              idx >= 5 ? 'text-indigo-400/80 bg-indigo-500/5' : 'text-slate-400 bg-slate-900/50'
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* 7x5 or 7x6 Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day) => {
          const dayPosts = postsByDateMap.get(day.dateString) || [];
          return (
            <CalendarCell
              key={day.dateString}
              day={day}
              posts={dayPosts}
            />
          );
        })}
      </div>
    </div>
  );
};

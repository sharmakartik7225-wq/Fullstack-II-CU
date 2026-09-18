import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { getWeekDays, getTimeSlots } from '../../utils/dateUtils';
import { WeekTimeSlot } from './WeekTimeSlot';
import { usePosts } from '../../context/PostContext';
import { usePerformance } from '../../context/PerformanceContext';
import { useRenderCounter } from '../../hooks/useRenderCounter';
import { Post } from '../../types';

export const WeekView: React.FC = () => {
  const { selectedDate, filteredPosts } = usePosts();
  const { isUseMemoEnabled } = usePerformance();
  const { renderCount, elementRef } = useRenderCounter({ componentName: 'WeekView' });

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const timeSlots = useMemo(() => getTimeSlots(6, 22), []);

  // Group filtered posts by composite key: `dateString_hour`
  const memoizedPostsByDateAndHour = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of filteredPosts) {
      if (!post.scheduledDate) continue;
      let postHour = 9; // default 9 AM
      if (post.scheduledTime) {
        const [h] = post.scheduledTime.split(':').map(Number);
        if (!isNaN(h)) postHour = h;
      }
      const key = `${post.scheduledDate}_${postHour}`;
      const existing = map.get(key) || [];
      existing.push(post);
      map.set(key, existing);
    }
    return map;
  }, [filteredPosts]);

  const unmemoizedPostsByDateAndHour = () => {
    const map = new Map<string, Post[]>();
    for (const post of filteredPosts) {
      if (!post.scheduledDate) continue;
      let postHour = 9;
      if (post.scheduledTime) {
        const [h] = post.scheduledTime.split(':').map(Number);
        if (!isNaN(h)) postHour = h;
      }
      const key = `${post.scheduledDate}_${postHour}`;
      const existing = map.get(key) || [];
      existing.push(post);
      map.set(key, existing);
    }
    return map;
  };

  const postsBySlotMap = isUseMemoEnabled
    ? memoizedPostsByDateAndHour
    : unmemoizedPostsByDateAndHour();

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="bg-slate-900/40 rounded-2xl border border-slate-800/80 shadow-md relative overflow-hidden flex flex-col"
    >
      {/* Sticky Top Header: 7 Days */}
      <div className="grid grid-cols-[80px_repeat(7,minmax(140px,1fr))] bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-20">
        {/* Corner Time Axis Header */}
        <div className="p-3 text-center border-r border-slate-800/80 text-xs font-semibold text-slate-400">
          Time
        </div>

        {/* 7 Day Column Headers */}
        {weekDays.map((day) => (
          <div
            key={day.dateString}
            className={`p-3 text-center border-r border-slate-800/80 last:border-r-0 ${
              day.isToday ? 'bg-indigo-950/30' : ''
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {format(day.date, 'EEE')}
            </div>
            <div
              className={`inline-flex items-center justify-center w-7 h-7 mt-1 rounded-full text-xs font-bold ${
                day.isToday
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                  : 'text-white'
              }`}
            >
              {day.dayNumber}
            </div>
          </div>
        ))}
      </div>

      {/* Scrollable Time Slots Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[680px] scrollbar-thin">
        <div className="grid grid-cols-[80px_repeat(7,minmax(140px,1fr))] min-w-[1000px]">
          {timeSlots.map((slot) => (
            <React.Fragment key={slot.hour}>
              {/* Left Time Label */}
              <div className="p-2.5 text-right pr-3 border-b border-r border-slate-800/80 bg-slate-950/40 text-[11px] font-mono text-slate-400 flex items-center justify-end select-none">
                {slot.label}
              </div>

              {/* 7 Columns for this hour */}
              {weekDays.map((day) => {
                const key = `${day.dateString}_${slot.hour}`;
                const slotPosts = postsBySlotMap.get(key) || [];
                return (
                  <WeekTimeSlot
                    key={key}
                    dateString={day.dateString}
                    hour={slot.hour}
                    timeString={slot.timeString}
                    posts={slotPosts}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

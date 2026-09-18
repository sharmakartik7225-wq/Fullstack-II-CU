import React, { useState } from 'react';
import { Plus, Bell } from 'lucide-react';
import { CalendarDay } from '../../utils/dateUtils';
import { Post } from '../../types';
import { PostCard } from '../Post/PostCard';
import { usePosts } from '../../context/PostContext';
import { usePerformance } from '../../context/PerformanceContext';
import { useRenderCounter } from '../../hooks/useRenderCounter';

interface CalendarCellProps {
  day: CalendarDay;
  posts: Post[];
  onDropPost?: (postId: string, targetDate: string) => void;
  onQuickAdd?: (dateStr: string) => void;
}

const CalendarCellBase: React.FC<CalendarCellProps> = ({
  day,
  posts,
  onDropPost,
  onQuickAdd
}) => {
  const { reschedulePost, openCreateModal, draggedPostId, reminders, setIsReminderModalOpen } = usePosts();
  const { isOptimized } = usePerformance();
  const [isDragOver, setIsDragOver] = useState(false);

  const { renderCount, elementRef } = useRenderCounter({
    componentName: `DayCell-${day.dateString}`,
    propsToTrack: { dateString: day.dateString, postsCount: posts.length }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const postId = e.dataTransfer.getData('text/plain') || draggedPostId;
    if (postId) {
      if (onDropPost) {
        onDropPost(postId, day.dateString);
      } else {
        reschedulePost(postId, day.dateString);
      }
    }
  };

  const handleCellClick = (e: React.MouseEvent) => {
    // Only open if clicking cell background, not inside a post card
    if ((e.target as HTMLElement).closest('[draggable="true"]')) return;
    if (onQuickAdd) onQuickAdd(day.dateString);
    else openCreateModal(day.dateString);
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCellClick}
      className={`min-h-[120px] p-2 rounded-xl border transition-all duration-150 flex flex-col justify-between group relative select-none ${
        day.isCurrentMonth
          ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
          : 'bg-slate-950/40 border-slate-900/60 opacity-40 hover:opacity-75'
      } ${
        day.isToday
          ? 'ring-1 ring-indigo-500/80 bg-indigo-950/20'
          : ''
      } ${
        isDragOver ? 'ring-2 ring-emerald-400 bg-emerald-950/30 border-emerald-500' : ''
      }`}
    >
      {/* Day Header: Date Number + Render Counter + Quick Add Button */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
              day.isToday
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 group-hover:text-white'
            }`}
          >
            {day.dayNumber}
          </span>
          {day.isToday && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400">
              Today
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Daily Reminder Indicator */}
          {day.isCurrentMonth && reminders.some((r) => r.isActive) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsReminderModalOpen(true);
              }}
              className="p-1 rounded text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
              title={`${reminders.filter((r) => r.isActive).length} active daily reminders configured`}
            >
              <Bell className="w-2.5 h-2.5" />
            </button>
          )}

          {/* Render count badge */}
          <span
            className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1 py-0.2 rounded border border-slate-800"
            title="Cell Render Count"
          >
            {renderCount}
          </span>

          {/* Quick add post button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openCreateModal(day.dateString);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all"
            title={`Schedule post for ${day.dateString}`}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Post Items in this Day Cell */}
      <div className="space-y-1 overflow-y-auto max-h-[140px] pr-0.5 scrollbar-thin">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} compact />
        ))}
      </div>

      {/* Footer hint if no posts */}
      {posts.length === 0 && (
        <div className="text-[10px] text-slate-600 text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to schedule
        </div>
      )}
    </div>
  );
};

// Optimized Comparator for Calendar Cell
const areCellPropsEqual = (prev: CalendarCellProps, next: CalendarCellProps) => {
  if (
    prev.day.dateString !== next.day.dateString ||
    prev.day.isCurrentMonth !== next.day.isCurrentMonth ||
    prev.day.isToday !== next.day.isToday ||
    prev.posts.length !== next.posts.length
  ) {
    return false;
  }

  for (let i = 0; i < prev.posts.length; i++) {
    if (
      prev.posts[i].id !== next.posts[i].id ||
      prev.posts[i].status !== next.posts[i].status ||
      prev.posts[i].title !== next.posts[i].title ||
      prev.posts[i].scheduledTime !== next.posts[i].scheduledTime ||
      prev.posts[i].platform !== next.posts[i].platform ||
      prev.posts[i].colorTag !== next.posts[i].colorTag
    ) {
      return false;
    }
  }

  return true;
};

const MemoizedCalendarCell = React.memo(CalendarCellBase, areCellPropsEqual);

export const CalendarCell: React.FC<CalendarCellProps> = (props) => {
  const { isReactMemoEnabled } = usePerformance();
  return isReactMemoEnabled ? <MemoizedCalendarCell {...props} /> : <CalendarCellBase {...props} />;
};

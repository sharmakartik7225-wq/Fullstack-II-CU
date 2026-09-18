import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Post } from '../../types';
import { PostCard } from '../Post/PostCard';
import { usePosts } from '../../context/PostContext';
import { usePerformance } from '../../context/PerformanceContext';
import { useRenderCounter } from '../../hooks/useRenderCounter';

interface WeekTimeSlotProps {
  dateString: string;
  hour: number;
  timeString: string;
  posts: Post[];
  onDropSlot?: (postId: string, date: string, time: string) => void;
  onSlotClick?: (date: string, time: string) => void;
}

const WeekTimeSlotBase: React.FC<WeekTimeSlotProps> = ({
  dateString,
  hour,
  timeString,
  posts,
  onDropSlot,
  onSlotClick
}) => {
  const { reschedulePost, openCreateModal, draggedPostId } = usePosts();
  const [isDragOver, setIsDragOver] = useState(false);

  const { renderCount, elementRef } = useRenderCounter({
    componentName: `WeekSlot-${dateString}-${hour}`,
    propsToTrack: { dateString, hour, postsCount: posts.length }
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
      if (onDropSlot) {
        onDropSlot(postId, dateString, timeString);
      } else {
        reschedulePost(postId, dateString, timeString);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[draggable="true"]')) return;
    if (onSlotClick) {
      onSlotClick(dateString, timeString);
    } else {
      openCreateModal(dateString, timeString);
    }
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`min-h-[72px] p-1.5 border-b border-r border-slate-800/60 transition-all duration-150 relative group cursor-pointer ${
        isDragOver
          ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-400'
          : 'bg-slate-900/20 hover:bg-slate-850/60'
      }`}
    >
      {/* Visual Render Counter Badge (subtle) */}
      <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-[8px] font-mono text-slate-500 bg-slate-950 px-1 rounded z-10 transition-opacity">
        R:{renderCount}
      </span>

      {/* Quick Add icon on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        {posts.length === 0 && (
          <span className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-800 shadow">
            <Plus className="w-2.5 h-2.5" /> Add at {timeString}
          </span>
        )}
      </div>

      {/* Post cards in this time slot */}
      <div className="space-y-1.5 relative z-10">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

// Memoized equality checker for Week Time Slot
const areSlotPropsEqual = (prev: WeekTimeSlotProps, next: WeekTimeSlotProps) => {
  if (
    prev.dateString !== next.dateString ||
    prev.hour !== next.hour ||
    prev.timeString !== next.timeString ||
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

const MemoizedWeekTimeSlot = React.memo(WeekTimeSlotBase, areSlotPropsEqual);

export const WeekTimeSlot: React.FC<WeekTimeSlotProps> = (props) => {
  const { isReactMemoEnabled } = usePerformance();
  return isReactMemoEnabled ? <MemoizedWeekTimeSlot {...props} /> : <WeekTimeSlotBase {...props} />;
};

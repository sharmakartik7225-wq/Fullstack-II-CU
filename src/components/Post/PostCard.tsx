import React from 'react';
import {
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  Share2,
  Send,
  FileText
} from 'lucide-react';
import { Post, PostStatus } from '../../types';
import { PLATFORM_CONFIGS, COLOR_TAGS } from '../../utils/platformConfig';
import { usePosts } from '../../context/PostContext';
import { usePerformance } from '../../context/PerformanceContext';
import { useRenderCounter } from '../../hooks/useRenderCounter';

interface PostCardProps {
  post: Post;
  compact?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onStatusChange?: (id: string, status: PostStatus) => void;
}

const PostCardBase: React.FC<PostCardProps> = ({
  post,
  compact = false,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange
}) => {
  const { openEditModal, deletePost, duplicatePost, updatePostStatus, setDraggedPostId } = usePosts();
  const { isOptimized } = usePerformance();
  const { renderCount, elementRef } = useRenderCounter({
    componentName: `PostCard-${post.id}`,
    propsToTrack: { id: post.id, status: post.status, title: post.title, time: post.scheduledTime }
  });

  const config = PLATFORM_CONFIGS[post.platform] || PLATFORM_CONFIGS.Twitter;
  const tagColor = COLOR_TAGS.find((t) => t.id === post.colorTag) || COLOR_TAGS[0];

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(post);
    else openEditModal(post);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(post.id);
    else deletePost(post.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDuplicate) onDuplicate(post.id);
    else duplicatePost(post.id);
  };

  const handleCycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: Record<PostStatus, PostStatus> = {
      Draft: 'Scheduled',
      Scheduled: 'Published',
      Published: 'Draft'
    };
    const targetStatus = nextStatus[post.status];
    if (onStatusChange) onStatusChange(post.id, targetStatus);
    else updatePostStatus(post.id, targetStatus);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', post.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPostId(post.id);
  };

  const handleDragEnd = () => {
    setDraggedPostId(null);
  };

  const getStatusIcon = () => {
    switch (post.status) {
      case 'Published':
        return <CheckCircle className="w-3 h-3 text-emerald-400" />;
      case 'Scheduled':
        return <Clock className="w-3 h-3 text-sky-400" />;
      case 'Draft':
      default:
        return <FileText className="w-3 h-3 text-slate-400" />;
    }
  };

  if (compact) {
    return (
      <div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleEdit}
        className={`group relative flex items-center justify-between gap-1 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md ${
          config.badgeBg
        } ${config.badgeBorder} ${config.badgeText} hover:brightness-110`}
        style={{ borderLeftWidth: '3px', borderLeftColor: tagColor.hex }}
        title={`${post.title} (${post.platform} - ${post.status})`}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: config.brandColor }} />
          {post.scheduledTime && (
            <span className="text-[10px] text-slate-400 font-mono shrink-0">
              {post.scheduledTime}
            </span>
          )}
          <span className="truncate text-slate-200 group-hover:text-white font-medium">
            {post.title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="opacity-70 group-hover:opacity-100">{getStatusIcon()}</span>
          {/* Render Counter Pill */}
          <span className="text-[9px] font-mono text-slate-400 bg-slate-900/80 px-1 rounded">
            {renderCount}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleEdit}
      className={`group relative rounded-xl border p-2.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-slate-700`}
      style={{ borderLeftWidth: '4px', borderLeftColor: tagColor.hex }}
    >
      {/* Header: Platform Badge, Time, Status */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: config.brandColor }}
          />
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${config.badgeText}`}>
            {post.platform === 'DailyTask' ? (post.taskCategory || 'Daily Routine') : post.platform}
          </span>
          {post.taskPriority && (
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                post.taskPriority === 'High'
                  ? 'bg-rose-500/20 text-rose-300'
                  : post.taskPriority === 'Medium'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {post.taskPriority}
            </span>
          )}
          {post.scheduledTime && (
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5 text-slate-500" />
              {post.scheduledTime}
            </span>
          )}
        </div>

        {/* Status Pill & Render Counter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCycleStatus}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 border transition-colors ${
              post.status === 'Published'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                : post.status === 'Scheduled'
                ? 'bg-sky-950 text-sky-300 border-sky-800 hover:bg-sky-900'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Click to cycle status: Draft -> Scheduled -> Published/Completed"
          >
            {getStatusIcon()}
            <span>{post.platform === 'DailyTask' && post.status === 'Published' ? 'Completed' : post.status}</span>
          </button>

          <span
            className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1 py-0.5 rounded border border-slate-800"
            title="Component Render Count"
          >
            R:{renderCount}
          </span>
        </div>
      </div>

      {/* Post Title */}
      <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
        {post.title}
      </h4>

      {/* Post Content Snippet */}
      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
        {post.content}
      </p>

      {/* Footer: Tags & Quick Hover Actions */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-800/60">
        <div className="flex items-center gap-1 overflow-hidden">
          {post.tags?.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[9px] font-mono text-indigo-400/90 bg-indigo-500/10 px-1.5 py-0.5 rounded truncate"
            >
              {tag}
            </span>
          ))}
          {(post.tags?.length || 0) > 2 && (
            <span className="text-[9px] text-slate-500">
              +{(post.tags?.length || 0) - 2}
            </span>
          )}
        </div>

        {/* Hover Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDuplicate}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            title="Duplicate Post"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={handleEdit}
            className="p-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800"
            title="Edit Post"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
            title="Delete Post"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Optimized Memoized Export with Custom Equality Comparator
const arePropsEqual = (prev: PostCardProps, next: PostCardProps) => {
  return (
    prev.post.id === next.post.id &&
    prev.post.title === next.post.title &&
    prev.post.content === next.post.content &&
    prev.post.status === next.post.status &&
    prev.post.scheduledDate === next.post.scheduledDate &&
    prev.post.scheduledTime === next.post.scheduledTime &&
    prev.post.platform === next.post.platform &&
    prev.post.colorTag === next.post.colorTag &&
    prev.compact === next.compact
  );
};

const MemoizedPostCard = React.memo(PostCardBase, arePropsEqual);

export const PostCard: React.FC<PostCardProps> = (props) => {
  const { isReactMemoEnabled } = usePerformance();
  // When React.memo is enabled, use the memoized component; otherwise use unmemoized component
  return isReactMemoEnabled ? <MemoizedPostCard {...props} /> : <PostCardBase {...props} />;
};

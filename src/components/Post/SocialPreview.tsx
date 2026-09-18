import React from 'react';
import {
  Heart,
  MessageCircle,
  Repeat,
  Share,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
  Globe,
  CheckCircle2,
  Send,
  BookOpen,
  Calendar,
  Clock,
  AlertCircle,
  FileCheck,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { Post } from '../../types';
import { PLATFORM_CONFIGS } from '../../utils/platformConfig';

interface SocialPreviewProps {
  post: Partial<Post>;
}

export const SocialPreview: React.FC<SocialPreviewProps> = ({ post }) => {
  const platform = post.platform || 'Twitter';
  const config = PLATFORM_CONFIGS[platform];
  const content = post.content || 'Start typing your post content or homework instructions to see the live preview here...';
  const title = post.title || 'Untitled Post / Task';

  // Highlight hashtags with blue text
  const renderHighlightedContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-sky-400 font-medium hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Daily Task & Homework Submission Preview Card
  if (platform === 'DailyTask') {
    const priority = post.taskPriority || 'High';
    const priorityColor =
      priority === 'High'
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        : priority === 'Medium'
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white max-w-lg mx-auto shadow-2xl font-sans">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">Daily Routine & Homework Hub</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  {post.taskCategory || 'Assignment'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Academic Task & Submission Reminder</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border font-semibold ${priorityColor}`}>
            {priority} Priority
          </span>
        </div>

        {/* Due Date & Time Banner */}
        <div className="mt-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Submission Deadline:</span>
            <strong className="text-white font-mono">{post.scheduledTime || '23:59'}</strong>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {post.scheduledDate || 'Today'}
          </span>
        </div>

        {/* Title */}
        <h4 className="mt-4 font-bold text-base text-white tracking-tight">
          {title}
        </h4>

        {/* Body Content / Instructions */}
        <div className="mt-2 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
          {renderHighlightedContent(content)}
        </div>

        {/* Homework Checklist Preview */}
        <div className="mt-3.5 space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/70">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <CheckSquare className="w-3 h-3 text-emerald-400" />
            <span>Task Submission Checklist:</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
            <span>Complete problem statements & code documentation</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
            <span>Verify output screenshots & test execution runs</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-amber-300">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">○</span>
            <span>Submit PDF upload / repository link to LMS</span>
          </div>
        </div>

        {/* Media Preview if attached */}
        {post.mediaUrl && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 max-h-56">
            <img src={post.mediaUrl} alt="Homework Attachment" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Submission Action Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Status: <strong>{post.status || 'Scheduled'}</strong></span>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Submit Homework / Complete</span>
          </button>
        </div>
      </div>
    );
  }

  if (platform === 'Twitter') {
    return (
      <div className="bg-black border border-slate-800 rounded-2xl p-4 text-white max-w-lg mx-auto shadow-2xl font-sans">
        {/* Author Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={config.avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-sm text-white">{config.handle.replace('@', '')}</span>
                <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400" />
              </div>
              <span className="text-xs text-slate-400">{config.handle} · Just now</span>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-500" />
        </div>

        {/* Tweet Content */}
        <div className="mt-3 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
          {renderHighlightedContent(content)}
        </div>

        {/* Media Preview if attached */}
        {post.mediaUrl && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 max-h-64">
            <img src={post.mediaUrl} alt="Media preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Tweet Metadata */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5 hover:text-sky-400 cursor-pointer transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{post.engagementEstimate?.comments || 12}</span>
            </div>
            <div className="flex items-center space-x-1.5 hover:text-emerald-400 cursor-pointer transition-colors">
              <Repeat className="w-4 h-4" />
              <span>{post.engagementEstimate?.shares || 34}</span>
            </div>
            <div className="flex items-center space-x-1.5 hover:text-rose-400 cursor-pointer transition-colors">
              <Heart className="w-4 h-4" />
              <span>{post.engagementEstimate?.likes || 189}</span>
            </div>
            <div className="flex items-center space-x-1.5 hover:text-sky-400 cursor-pointer transition-colors">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <Share className="w-4 h-4 hover:text-slate-200 cursor-pointer" />
        </div>
      </div>
    );
  }

  if (platform === 'LinkedIn') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 max-w-lg mx-auto shadow-2xl font-sans">
        {/* LinkedIn Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={config.avatarUrl}
              alt="Avatar"
              className="w-11 h-11 rounded-full object-cover border border-slate-700"
            />
            <div>
              <h4 className="font-semibold text-sm text-white">{config.handle}</h4>
              <p className="text-[11px] text-slate-400">Official Tech & Engineering Page</p>
              <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                <span>Scheduled Post</span>
                <span>•</span>
                <Globe className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>
          <button className="text-xs text-blue-400 font-semibold px-3 py-1 rounded-full border border-blue-400/30 hover:bg-blue-500/10">
            + Follow
          </button>
        </div>

        {/* Title */}
        <div className="mt-3 font-semibold text-sm text-white">
          {title}
        </div>

        {/* Content */}
        <div className="mt-2 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
          {renderHighlightedContent(content)}
        </div>

        {/* Media Preview */}
        {post.mediaUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 max-h-60">
            <img src={post.mediaUrl} alt="Media preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Engagement Stats */}
        <div className="mt-3 py-2 border-y border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">👍</span>
            <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[8px] text-white">👏</span>
            <span className="ml-1">{post.engagementEstimate?.likes || 420}</span>
          </div>
          <div>
            <span>{post.engagementEstimate?.comments || 48} comments</span> · <span>{post.engagementEstimate?.shares || 18} reposts</span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mt-2 flex items-center justify-around text-xs text-slate-300 font-medium">
          <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer py-1">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Like</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer py-1">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Comment</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer py-1">
            <Repeat className="w-3.5 h-3.5" />
            <span>Repost</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer py-1">
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </div>
        </div>
      </div>
    );
  }

  if (platform === 'Instagram') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white max-w-sm mx-auto shadow-2xl font-sans">
        {/* Instagram Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
              <img
                src={config.avatarUrl}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border border-black"
              />
            </div>
            <div>
              <span className="font-bold text-xs text-white">{config.handle}</span>
              <p className="text-[10px] text-slate-400">Original audio</p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>

        {/* Image Box */}
        <div className="mt-3 rounded-xl overflow-hidden bg-slate-950 aspect-square border border-slate-800 flex items-center justify-center">
          {post.mediaUrl ? (
            <img src={post.mediaUrl} alt="Instagram Post" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4">
              <p className="text-xs text-slate-500">Image will appear here</p>
              <p className="text-[10px] text-indigo-400 mt-1 font-mono">{title}</p>
            </div>
          )}
        </div>

        {/* IG Action Icons */}
        <div className="mt-3 flex items-center justify-between text-slate-200">
          <div className="flex items-center space-x-4">
            <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer transition-colors" />
            <MessageCircle className="w-5 h-5 hover:text-slate-400 cursor-pointer transition-colors" />
            <Send className="w-5 h-5 hover:text-slate-400 cursor-pointer transition-colors" />
          </div>
          <Bookmark className="w-5 h-5 hover:text-slate-400 cursor-pointer" />
        </div>

        {/* Likes */}
        <div className="mt-2 text-xs font-bold text-white">
          {(post.engagementEstimate?.likes || 1240).toLocaleString()} likes
        </div>

        {/* Caption */}
        <div className="mt-1 text-xs text-slate-200 leading-relaxed">
          <span className="font-bold mr-1.5 text-white">{config.handle}</span>
          {renderHighlightedContent(content)}
        </div>
      </div>
    );
  }

  // Facebook Preview
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white max-w-lg mx-auto shadow-2xl font-sans">
      {/* FB Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={config.avatarUrl}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-slate-700"
          />
          <div>
            <h4 className="font-bold text-xs text-white">{config.handle}</h4>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <span>Just now</span>
              <span>·</span>
              <Globe className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-slate-500" />
      </div>

      {/* Title & Body */}
      <div className="mt-3 text-xs text-slate-100 whitespace-pre-wrap leading-relaxed">
        {renderHighlightedContent(content)}
      </div>

      {/* Media Attachment */}
      {post.mediaUrl && (
        <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 max-h-64">
          <img src={post.mediaUrl} alt="FB Media" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Reaction Counts */}
      <div className="mt-3 pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white">👍</span>
          <span className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-[9px] text-white">❤️</span>
          <span className="ml-1">{post.engagementEstimate?.likes || 630}</span>
        </div>
        <div>
          <span>{post.engagementEstimate?.comments || 54} Comments</span> · <span>{post.engagementEstimate?.shares || 22} Shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2 pt-1 border-t border-slate-800/80 flex items-center justify-around text-xs text-slate-300 font-medium">
        <div className="flex items-center space-x-1.5 py-1 hover:text-indigo-400 cursor-pointer">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Like</span>
        </div>
        <div className="flex items-center space-x-1.5 py-1 hover:text-indigo-400 cursor-pointer">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Comment</span>
        </div>
        <div className="flex items-center space-x-1.5 py-1 hover:text-indigo-400 cursor-pointer">
          <Share className="w-3.5 h-3.5" />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
};

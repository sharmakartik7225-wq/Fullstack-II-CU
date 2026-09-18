import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Tag,
  Image as ImageIcon,
  Sparkles,
  Send,
  Eye,
  CheckCircle,
  AlertCircle,
  Trash2,
  Copy
} from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { Post, PlatformType, PostStatus } from '../../types';
import { PLATFORM_CONFIGS, COLOR_TAGS, POPULAR_HASHTAGS } from '../../utils/platformConfig';
import { SocialPreview } from './SocialPreview';

const SAMPLE_MEDIA_OPTIONS = [
  { label: 'Code & Tech', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80' },
  { label: 'UI / UX Design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Abstract Gradient', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
  { label: 'Team & Workspace', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80' }
];

export const PostModal: React.FC = () => {
  const { isModalOpen, activePost, closeModal, createPost, updatePost, deletePost, duplicatePost, createReminder } = usePosts();

  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    content: '',
    platform: 'Twitter',
    scheduledDate: '',
    scheduledTime: '09:00',
    status: 'Draft',
    colorTag: 'sky',
    mediaUrl: '',
    tags: []
  });

  const [recurringDays, setRecurringDays] = useState<number>(0);
  const [createReminderAlong, setCreateReminderAlong] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    if (activePost) {
      setFormData({ ...activePost });
      setRecurringDays(0);
      setCreateReminderAlong(false);
    }
  }, [activePost]);

  if (!isModalOpen) return null;

  const isEditing = Boolean(formData.id);
  const currentPlatform = formData.platform || 'Twitter';
  const platformConfig = PLATFORM_CONFIGS[currentPlatform];
  const charLimit = platformConfig.characterLimit;
  const currentLength = formData.content?.length || 0;
  const isOverLimit = currentLength > charLimit;
  const percentage = Math.min(100, Math.round((currentLength / charLimit) * 100));

  const handleAppendHashtag = (tag: string) => {
    const currentContent = formData.content || '';
    if (!currentContent.includes(tag)) {
      const separator = currentContent.endsWith(' ') || currentContent.length === 0 ? '' : ' ';
      setFormData((prev) => ({
        ...prev,
        content: `${currentContent}${separator}${tag}`,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    if (isEditing && formData.id) {
      updatePost(formData as Post);
    } else {
      createPost({
        title: formData.title || 'Untitled Post',
        content: formData.content || '',
        platform: formData.platform || 'Twitter',
        scheduledDate: formData.scheduledDate || new Date().toISOString().split('T')[0],
        scheduledTime: formData.scheduledTime || '09:00',
        status: formData.status || 'Draft',
        colorTag: formData.colorTag || 'sky',
        mediaUrl: formData.mediaUrl || undefined,
        tags: formData.tags || ['#WebDev'],
        taskPriority: formData.taskPriority || 'High',
        taskCategory: formData.taskCategory || (formData.platform === 'DailyTask' ? 'Homework' : undefined)
      }, recurringDays);

      if (createReminderAlong) {
        createReminder({
          title: `Daily Reminder: ${formData.title}`,
          time: formData.scheduledTime || '09:00',
          platforms: [formData.platform || 'Twitter'],
          repeatType: 'daily',
          isActive: true,
          colorTag: formData.colorTag || 'sky',
          notes: formData.content?.slice(0, 100),
          taskCategory: formData.taskCategory
        });
      }
    }
  };

  const platforms: PlatformType[] = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'DailyTask'];
  const statuses: PostStatus[] = ['Draft', 'Scheduled', 'Published'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isEditing ? 'Edit Scheduled Post' : 'Compose New Post'}
              </h3>
              <p className="text-xs text-slate-400">
                Configure details, scheduling slots, and cross-platform formatting
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tab switcher: Editor vs Preview */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'editor'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Editor Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              onClick={closeModal}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
          {activeTab === 'preview' ? (
            <div className="py-4">
              <div className="text-center mb-4">
                <span className="text-xs font-medium text-slate-400">
                  Simulated realistic feed preview for{' '}
                  <strong className="text-white">{platformConfig.displayName}</strong>
                </span>
              </div>
              <SocialPreview post={formData} />
            </div>
          ) : (
            <form id="post-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Platform Selector Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Target Platform / Activity Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {platforms.map((plat) => {
                    const cfg = PLATFORM_CONFIGS[plat];
                    const isSelected = formData.platform === plat;
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setFormData((prev) => ({
                          ...prev,
                          platform: plat,
                          taskCategory: plat === 'DailyTask' ? (prev.taskCategory || 'Homework') : undefined,
                          taskPriority: plat === 'DailyTask' ? (prev.taskPriority || 'High') : undefined
                        }))}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                          isSelected
                            ? `${cfg.badgeBg} ${cfg.badgeText} border-indigo-500 shadow-md ring-1 ring-indigo-500/50`
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cfg.brandColor }}
                          />
                          <span className="truncate">{plat === 'DailyTask' ? 'Daily Routine' : plat}</span>
                        </div>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Task Category & Priority Selectors if DailyTask is selected */}
              {formData.platform === 'DailyTask' && (
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Task Category & Submission Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Category */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Task Type
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {(['Homework', 'Assignment', 'DailyRoutine', 'Project', 'Study'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, taskCategory: cat }))}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                              formData.taskCategory === cat
                                ? 'bg-amber-500/30 text-amber-200 border-amber-500 shadow-sm'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {cat === 'DailyRoutine' ? 'Daily Routine' : cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Urgency / Priority
                      </label>
                      <div className="flex gap-2">
                        {(['High', 'Medium', 'Low'] as const).map((prio) => (
                          <button
                            key={prio}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, taskPriority: prio }))}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border flex-1 transition-all ${
                              formData.taskPriority === prio
                                ? prio === 'High'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 font-bold'
                                  : prio === 'Medium'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {prio}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Title Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {formData.platform === 'DailyTask' ? 'Homework / Task Title' : 'Post Campaign Title'} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder={
                    formData.platform === 'DailyTask'
                      ? 'e.g., 📚 Submit Full Stack Lab Experiment 4 Report'
                      : 'e.g., Q3 Product Feature Announcement'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Content Textarea with Character Limit Gauge */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {formData.platform === 'DailyTask' ? 'Task Description & Submission Checklist' : 'Post Copy / Content'}
                  </label>
                  <span
                    className={`text-[11px] font-mono font-medium ${
                      isOverLimit ? 'text-rose-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {currentLength} / {charLimit} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.content || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write captivating post copy, tag colleagues, add emojis..."
                  className={`w-full bg-slate-950 border rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-sans leading-relaxed ${
                    isOverLimit
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
                {/* Visual Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOverLimit
                        ? 'bg-rose-500'
                        : percentage > 85
                        ? 'bg-amber-400'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Hashtag Quick Insertion */}
              <div>
                <span className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  Quick Hashtag Recommendations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAppendHashtag(tag)}
                      className="px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 text-[11px] font-mono border border-slate-700 hover:border-indigo-500/50 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduling Date, Time & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Scheduled Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Scheduled Time</span>
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime || '09:00'}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, scheduledTime: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Post Status
                  </label>
                  <select
                    value={formData.status || 'Draft'}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, status: e.target.value as PostStatus }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Tag & Media URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Color Tag Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Calendar Category Tag</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {COLOR_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, colorTag: tag.id }))}
                        className={`w-7 h-7 rounded-xl transition-all ${tag.bg} ${
                          formData.colorTag === tag.id
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110 shadow-lg'
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                        title={tag.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Media Attachment URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Media URL (Image / Cover)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.mediaUrl || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, mediaUrl: e.target.value }))
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                  {/* Preset Quick Images */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-slate-500">Presets:</span>
                    {SAMPLE_MEDIA_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, mediaUrl: opt.url }))}
                        className="text-[10px] text-indigo-400 hover:underline"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daily Reminder & Recurring Schedule Section */}
              {!isEditing && (
                <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Daily Automation & Reminders</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Recurring Series Option */}
                    <label className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={recurringDays === 7}
                        onChange={(e) => setRecurringDays(e.target.checked ? 7 : 0)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Schedule 7-Day Recurring Series
                        </span>
                        <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                          Creates this post across the next 7 consecutive calendar days automatically
                        </span>
                      </div>
                    </label>

                    {/* Set Daily Reminder Option */}
                    <label className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={createReminderAlong}
                        onChange={(e) => setCreateReminderAlong(e.target.checked)}
                        className="mt-0.5 rounded text-amber-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                      <div>
                        <span className="text-xs font-semibold text-amber-300 block">
                          Set as Daily Posting Reminder
                        </span>
                        <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                          Adds a recurring reminder at {formData.scheduledTime || '09:00'} to your Reminders tab
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div>
            {isEditing && formData.id && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => deletePost(formData.id!)}
                  className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => duplicatePost(formData.id!)}
                  className="px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="post-form"
              disabled={isOverLimit}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Update Schedule' : 'Schedule Post'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

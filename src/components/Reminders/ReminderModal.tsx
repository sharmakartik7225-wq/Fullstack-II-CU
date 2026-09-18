import React, { useState } from 'react';
import {
  X,
  Bell,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Power,
  Edit2,
  ArrowRight
} from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { DailyReminder, PlatformType, ReminderRepeatType } from '../../types';
import { PLATFORM_CONFIGS, COLOR_TAGS } from '../../utils/platformConfig';

export const ReminderModal: React.FC = () => {
  const {
    isReminderModalOpen,
    setIsReminderModalOpen,
    reminders,
    createReminder,
    deleteReminder,
    toggleReminderStatus,
    openCreateModal
  } = usePosts();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Omit<DailyReminder, 'id' | 'createdAt'>>({
    title: '',
    time: '09:00',
    platforms: ['Twitter', 'LinkedIn'],
    repeatType: 'daily',
    isActive: true,
    colorTag: 'sky',
    notes: ''
  });

  if (!isReminderModalOpen) return null;

  const platforms: PlatformType[] = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'];
  const repeatTypes: { value: ReminderRepeatType; label: string }[] = [
    { value: 'daily', label: 'Every Day (Daily)' },
    { value: 'weekdays', label: 'Weekdays (Mon - Fri)' },
    { value: 'weekends', label: 'Weekends (Sat - Sun)' }
  ];

  const handleTogglePlatform = (plat: PlatformType) => {
    setFormData((prev) => {
      const exists = prev.platforms.includes(plat);
      const updated = exists ? prev.platforms.filter((p) => p !== plat) : [...prev.platforms, plat];
      return { ...prev, platforms: updated.length === 0 ? [plat] : updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    createReminder(formData);
    setFormData({
      title: '',
      time: '09:00',
      platforms: ['Twitter', 'LinkedIn'],
      repeatType: 'daily',
      isActive: true,
      colorTag: 'sky',
      notes: ''
    });
    setIsAddingNew(false);
  };

  const handleCreatePostFromReminder = (reminder: DailyReminder) => {
    setIsReminderModalOpen(false);
    openCreateModal(undefined, reminder.time);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Daily Posting Reminders & Recurring Schedule</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {reminders.filter((r) => r.isActive).length} Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Configure daily social habits, posting cadence notifications, and auto-templates
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddingNew((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'View Reminders' : 'New Reminder'}</span>
            </button>

            <button
              onClick={() => setIsReminderModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin">
          {isAddingNew ? (
            /* Add New Reminder Form */
            <form onSubmit={handleSubmit} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Create Daily Scheduled Reminder</span>
              </h4>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Reminder Title / Habit Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Morning Architecture Insight & Tech Tip"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Time & Repeat Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Daily Alert Time</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Frequency</span>
                  </label>
                  <select
                    value={formData.repeatType}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, repeatType: e.target.value as ReminderRepeatType }))
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {repeatTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Platforms */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Target Social Networks
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((plat) => {
                    const cfg = PLATFORM_CONFIGS[plat];
                    const isSelected = formData.platforms.includes(plat);
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => handleTogglePlatform(plat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? `${cfg.badgeBg} ${cfg.badgeText} border-indigo-500 shadow-sm`
                            : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.brandColor }} />
                        <span>{plat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Tag */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Color Tag Category
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_TAGS.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, colorTag: tag.id }))}
                      className={`w-6 h-6 rounded-lg transition-all ${tag.bg} ${
                        formData.colorTag === tag.id
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110 shadow'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      title={tag.name}
                    />
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Reminder Notes & Guidelines (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g., Include poll question and 3 relevant hashtags"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Save Daily Reminder
                </button>
              </div>
            </form>
          ) : (
            /* Reminders List */
            <div className="space-y-3">
              {reminders.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No daily reminders configured yet.
                  <br />
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                  >
                    + Add First Daily Reminder
                  </button>
                </div>
              ) : (
                reminders.map((reminder) => {
                  const tagColor = COLOR_TAGS.find((t) => t.id === reminder.colorTag) || COLOR_TAGS[0];

                  return (
                    <div
                      key={reminder.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 bg-slate-950/70 hover:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        reminder.isActive ? 'border-slate-800' : 'border-slate-900 opacity-60'
                      }`}
                      style={{ borderLeftWidth: '4px', borderLeftColor: tagColor.hex }}
                    >
                      {/* Left: Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs sm:text-sm text-white flex items-center gap-1.5">
                            <span>{reminder.title}</span>
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                              reminder.isActive
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}
                          >
                            {reminder.isActive ? 'ACTIVE' : 'MUTED'}
                          </span>
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-mono text-indigo-300 font-semibold">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {reminder.time}
                          </span>
                          <span className="capitalize text-slate-500 font-mono">
                            • {reminder.repeatType}
                          </span>
                          <div className="flex items-center gap-1">
                            {reminder.platforms.map((p) => {
                              const cfg = PLATFORM_CONFIGS[p];
                              return (
                                <span
                                  key={p}
                                  className="text-[10px] px-1.5 py-0.2 rounded font-medium"
                                  style={{ backgroundColor: `${cfg.brandColor}20`, color: cfg.brandColor }}
                                >
                                  {p}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {reminder.notes && (
                          <p className="text-[11px] text-slate-400 italic pt-0.5">
                            "{reminder.notes}"
                          </p>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {/* Quick Post button */}
                        <button
                          onClick={() => handleCreatePostFromReminder(reminder)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-slate-800 hover:border-indigo-500/50 text-xs font-medium flex items-center gap-1.5 transition-all"
                          title="Schedule post pre-filled with this reminder's time slot"
                        >
                          <span>Compose Post</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        {/* Active Toggle */}
                        <button
                          onClick={() => toggleReminderStatus(reminder.id)}
                          className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                            reminder.isActive
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/60'
                              : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                          }`}
                          title={reminder.isActive ? 'Mute reminder' : 'Activate reminder'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Reminder Button */}
                        <button
                          onClick={() => deleteReminder(reminder.id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800 transition-colors"
                          title="Delete reminder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
          <span>
            Daily reminders appear in your schedule calendar and notify you at your configured time.
          </span>
          <button
            onClick={() => setIsReminderModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

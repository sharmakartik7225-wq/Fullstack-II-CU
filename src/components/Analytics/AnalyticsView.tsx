import React, { useMemo } from 'react';
import {
  X,
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { usePerformance } from '../../context/PerformanceContext';
import { PLATFORM_CONFIGS } from '../../utils/platformConfig';
import { PlatformType } from '../../types';
import { useRenderCounter } from '../../hooks/useRenderCounter';

export const AnalyticsView: React.FC = () => {
  const { isAnalyticsOpen, setIsAnalyticsOpen, posts } = usePosts();
  const { isUseMemoEnabled } = usePerformance();
  const { renderCount, elementRef } = useRenderCounter({ componentName: 'AnalyticsView' });

  // Heavy computation simulation for analytics metrics
  const calculateAnalyticsMetrics = (postList: typeof posts) => {
    let totalLikes = 0;
    let totalShares = 0;
    let totalComments = 0;
    let totalReach = 0;

    const platformCounts: Record<PlatformType, number> = {
      Twitter: 0,
      LinkedIn: 0,
      Instagram: 0,
      Facebook: 0,
      DailyTask: 0
    };

    const statusCounts = {
      Published: 0,
      Scheduled: 0,
      Draft: 0
    };

    const hourFrequency: Record<number, number> = {};

    for (const p of postList) {
      // Platform breakdown
      platformCounts[p.platform] = (platformCounts[p.platform] || 0) + 1;
      // Status breakdown
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
      // Engagement
      if (p.engagementEstimate) {
        totalLikes += p.engagementEstimate.likes;
        totalShares += p.engagementEstimate.shares;
        totalComments += p.engagementEstimate.comments;
        totalReach += p.engagementEstimate.reach;
      }
      // Hour analysis
      if (p.scheduledTime) {
        const [h] = p.scheduledTime.split(':').map(Number);
        if (!isNaN(h)) {
          hourFrequency[h] = (hourFrequency[h] || 0) + 1;
        }
      }
    }

    return {
      totalLikes,
      totalShares,
      totalComments,
      totalReach,
      platformCounts,
      statusCounts,
      hourFrequency
    };
  };

  // In useMemo mode: memoizes aggregate computation
  // In unmemoized mode: recalculates from scratch on every single keystroke/render
  const memoizedMetrics = useMemo(() => {
    return calculateAnalyticsMetrics(posts);
  }, [posts]);

  const metrics = isUseMemoEnabled ? memoizedMetrics : calculateAnalyticsMetrics(posts);

  if (!isAnalyticsOpen) return null;

  const platforms: PlatformType[] = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'DailyTask'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Campaign Analytics & Cadence Heatmap</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Renders: {renderCount}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Aggregated performance metrics across scheduled and published social content
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAnalyticsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Total Posts</span>
                <Calendar className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{posts.length}</div>
              <div className="text-[10px] text-slate-500 mt-1">Across all networks</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Estimated Reach</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {metrics.totalReach.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2% vs last period
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Total Interactions</span>
                <Heart className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {(metrics.totalLikes + metrics.totalShares + metrics.totalComments).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {metrics.totalLikes} likes · {metrics.totalShares} shares
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Published Ratio</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {posts.length > 0
                  ? Math.round((metrics.statusCounts.Published / posts.length) * 100)
                  : 0}
                %
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {metrics.statusCounts.Published} / {posts.length} posted
              </div>
            </div>
          </div>

          {/* Platform Distribution & Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform Distribution */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
                Platform Share
              </h4>
              <div className="space-y-3">
                {platforms.map((plat) => {
                  const cfg = PLATFORM_CONFIGS[plat];
                  const count = metrics.platformCounts[plat] || 0;
                  const pct = posts.length > 0 ? Math.round((count / posts.length) * 100) : 0;
                  return (
                    <div key={plat}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: cfg.brandColor }}
                          />
                          <span className="text-slate-200 font-medium">{plat}</span>
                        </div>
                        <span className="text-slate-400 font-mono">
                          {count} posts ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: cfg.brandColor
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
                Workflow Status Pipeline
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Published
                    </span>
                    <span className="text-slate-400 font-mono">
                      {metrics.statusCounts.Published} posts
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${
                          posts.length > 0
                            ? (metrics.statusCounts.Published / posts.length) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-sky-400 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5" /> Scheduled
                    </span>
                    <span className="text-slate-400 font-mono">
                      {metrics.statusCounts.Scheduled} posts
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all"
                      style={{
                        width: `${
                          posts.length > 0
                            ? (metrics.statusCounts.Scheduled / posts.length) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <FileText className="w-3.5 h-3.5" /> Drafts
                    </span>
                    <span className="text-slate-400 font-mono">
                      {metrics.statusCounts.Draft} posts
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-600 rounded-full transition-all"
                      style={{
                        width: `${
                          posts.length > 0 ? (metrics.statusCounts.Draft / posts.length) * 100 : 0
                        }%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cadence Hourly Heatmap */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
              Time-of-Day Scheduling Cadence
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Distribution of posts across the 24-hour day to maximize audience engagement
            </p>
            <div className="grid grid-cols-12 gap-1 text-center font-mono text-[10px]">
              {Array.from({ length: 24 }).map((_, hour) => {
                const count = metrics.hourFrequency[hour] || 0;
                const opacity = count > 2 ? 'bg-indigo-500' : count > 0 ? 'bg-indigo-600/60' : 'bg-slate-900';
                return (
                  <div key={hour} className="flex flex-col items-center">
                    <div
                      className={`w-full h-10 rounded-lg flex items-center justify-center font-bold text-white transition-all ${opacity}`}
                      title={`${hour}:00 - ${count} posts`}
                    >
                      {count > 0 ? count : ''}
                    </div>
                    <span className="mt-1 text-slate-500 text-[9px]">
                      {hour}:00
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={() => setIsAnalyticsOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

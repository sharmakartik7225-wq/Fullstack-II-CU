import React from 'react';
import { Search, X, Filter, Tag, Check } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { PLATFORM_CONFIGS, COLOR_TAGS } from '../../utils/platformConfig';
import { PlatformType, PostStatus } from '../../types';
import { useRenderCounter } from '../../hooks/useRenderCounter';

export const FilterBar: React.FC = () => {
  const { filterOptions, setSearchQuery, togglePlatformFilter, toggleStatusFilter, setColorTagFilter, resetFilters, filteredPosts, posts } = usePosts();
  const { renderCount, elementRef } = useRenderCounter({ componentName: 'FilterBar' });

  const platforms: PlatformType[] = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'DailyTask'];
  const statuses: PostStatus[] = ['Draft', 'Scheduled', 'Published'];

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 transition-all duration-300 relative shadow-sm"
    >
      {/* Visual Render Counter Badge */}
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/60 text-[10px] font-mono text-slate-400">
        Renders: <span className="text-indigo-300 font-semibold">{renderCount}</span>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterOptions.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts by title, content, or hashtag #..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
          />
          {filterOptions.searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Platforms Filter */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/70">
            {platforms.map((platform) => {
              const isSelected = filterOptions.platforms.includes(platform);
              const config = PLATFORM_CONFIGS[platform];
              return (
                <button
                  key={platform}
                  onClick={() => togglePlatformFilter(platform)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? `${config.badgeBg} ${config.badgeText} border ${config.badgeBorder} shadow-sm`
                      : 'text-slate-500 hover:text-slate-300 opacity-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.brandColor }} />
                  <span>{platform}</span>
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/70">
            {statuses.map((status) => {
              const isSelected = filterOptions.statuses.includes(status);
              const statusColor =
                status === 'Published'
                  ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                  : status === 'Scheduled'
                  ? 'text-sky-400 border-sky-500/30 bg-sky-500/10'
                  : 'text-slate-400 border-slate-700 bg-slate-800/60';

              return (
                <button
                  key={status}
                  onClick={() => toggleStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? `${statusColor} border shadow-sm`
                      : 'text-slate-500 hover:text-slate-300 opacity-50'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Color Tag Filter */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/70">
            <Tag className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1" />
            <button
              onClick={() => setColorTagFilter(undefined)}
              className={`w-5 h-5 rounded-full border text-[10px] flex items-center justify-center transition-all ${
                !filterOptions.colorTag
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                  : 'border-slate-800 text-slate-500 hover:border-slate-600'
              }`}
              title="All color tags"
            >
              All
            </button>
            {COLOR_TAGS.map((tag) => (
              <button
                key={tag.id}
                onClick={() =>
                  setColorTagFilter(filterOptions.colorTag === tag.id ? undefined : tag.id)
                }
                className={`w-5 h-5 rounded-full transition-transform ${tag.bg} ${
                  filterOptions.colorTag === tag.id
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                title={tag.name}
              />
            ))}
          </div>

          {/* Results count & Reset */}
          <div className="flex items-center gap-2 pl-1 text-xs text-slate-400">
            <span>
              Showing <strong className="text-white font-medium">{filteredPosts.length}</strong> / {posts.length}
            </span>
            {(filterOptions.searchQuery ||
              filterOptions.platforms.length < 4 ||
              filterOptions.statuses.length < 3 ||
              filterOptions.colorTag) && (
              <button
                onClick={resetFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

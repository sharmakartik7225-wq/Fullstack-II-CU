# Performance Engineering & Optimization Guide

This guide details the exact performance diagnostic patterns, optimization techniques, and profiling methods implemented in **SocialPulse (Experiment 4)**.

---

## 1. The Bottleneck: Cascade Re-rendering in Calendar Grids

In a naive React calendar application:
- The calendar renders **35 to 42 day cells** in Month View and **119 time slots** in Week View.
- Each cell contains between 0 and 10+ post badges.
- When a user types a single character in the search filter, the root component's state changes.
- In Unoptimized Mode, React walks the entire virtual DOM tree and re-renders every single cell and post card, even though their props did not change.

---

## 2. Techniques Implemented in Experiment 4

### Technique 1: Custom Prop Equality in `React.memo`
```tsx
const areCellPropsEqual = (prev: CalendarCellProps, next: CalendarCellProps) => {
  if (
    prev.day.dateString !== next.day.dateString ||
    prev.day.isCurrentMonth !== next.day.isCurrentMonth ||
    prev.day.isToday !== next.day.isToday ||
    prev.posts.length !== next.posts.length
  ) {
    return false;
  }

  // Deep comparison of individual post IDs and statuses
  for (let i = 0; i < prev.posts.length; i++) {
    if (
      prev.posts[i].id !== next.posts[i].id ||
      prev.posts[i].status !== next.posts[i].status ||
      prev.posts[i].title !== next.posts[i].title ||
      prev.posts[i].scheduledTime !== next.posts[i].scheduledTime
    ) {
      return false;
    }
  }

  return true;
};

export const CalendarCell = React.memo(CalendarCellBase, areCellPropsEqual);
```

### Technique 2: Stabilizing Callbacks with `useCallback`
Without `useCallback`, functions like `openEditModal` and `reschedulePost` create new references on every render, causing memoized children to fail shallow comparison:
```tsx
const reschedulePost = useCallback((id: string, newDate: string, newTime?: string) => {
  setPosts((prev) =>
    prev.map((p) => (p.id === id ? { ...p, scheduledDate: newDate, scheduledTime: newTime || p.scheduledTime } : p))
  );
}, []);
```

### Technique 3: Grouping & Aggregation with `useMemo`
```tsx
const memoizedPostsByDate = useMemo(() => {
  const map = new Map<string, Post[]>();
  for (const post of filteredPosts) {
    const existing = map.get(post.scheduledDate) || [];
    existing.push(post);
    map.set(post.scheduledDate, existing);
  }
  return map;
}, [filteredPosts]);
```

---

## 3. Real-Time Telemetry & Visual Indicators

1. **Render Flashes (Green vs Red):**
   - Red flash indicates a component render occurring in unoptimized mode where child props were unchanged.
   - Green flash indicates an intentional, necessary render.
2. **Telemetry HUD:**
   - Real-time framerate (FPS) measured via `requestAnimationFrame`.
   - Commit latency measured via `<React.Profiler>`.
3. **Automated Stress Benchmark:**
   - Simulates 25 rapid interactions with 100+ items and logs exact frame times and wasted renders.

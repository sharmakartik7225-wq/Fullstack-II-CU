# SocialPulse - Social Media Post Scheduler & Live Performance Lab (Exp 4)

A production-grade, highly interactive **Social Media Post Scheduler & Calendar Interface** built with React 19, TypeScript, Tailwind CSS, and Lucide Icons. Incorporates a **Live Performance Optimization Engine** that visually demonstrates rendering bottlenecks, memoization techniques (`React.memo`, `useMemo`, `useCallback`), profiling diagnostics, and stress benchmarks.

---

## 🌟 Key Features

### 1. Interactive Calendar & Scheduler Views
- **Month View:** 7x5 / 7x6 day grid showing scheduled post badges, color categories, platform branding, today indicators, and click-to-schedule.
- **Week / Time-Slot View:** Multi-column hourly breakdown (06:00 to 22:00) with precise time slots, interactive scheduling, and status tracking.
- **Drag-and-Drop Rescheduling:** Drag any post between calendar days or hourly time slots to reschedule instantly.

### 2. Cross-Platform Post Composer & Live Preview
- **Target Platforms:** Twitter/X, LinkedIn, Instagram, and Facebook.
- **Character Counter & Limit Gauges:** Dynamic progress bar enforcing platform-specific character limits (Twitter: 280, LinkedIn: 3000, Instagram: 2200, Facebook: 63206).
- **Realistic Feed Simulator:** Live preview showing exactly how the post will appear in feeds with verified badges, company cards, media attachments, and interactive buttons.
- **Category Tagging:** Color-coded labels (Emerald, Sky, Purple, Rose, Amber, Indigo, Cyan).
- **Hashtag Recommendations:** Click-to-append trending hashtags (`#ReactJS`, `#WebDev`, `#AI`, etc.).

### 3. Live Performance Optimization Engine
- **Toggle Optimization Mode:** Switch in real-time between **Unoptimized Mode** (naive rendering with prop reference thrashing and unmemoized cascades) and **Optimized Mode** (`React.memo` with custom comparators, `useMemo`, and `useCallback`).
- **Visual Render Flashes & Badges:** Real-time visual highlight flash and counter badge on every calendar cell, time slot, and post card.
- **Telemetry HUD:** Live FPS counter, React Profiler last-render commit time (ms), total re-render counts, and wasted re-render counter.
- **Artificial CPU Stress Regulator:** Inject 0ms to 30ms of synchronous computational work to simulate heavy real-world data pipelines.
- **Automated Side-by-Side Benchmark:** Run 25 automated UI interactions over 100+ posts and measure execution time, frame duration, and speedup multiplier.
- **"Why Did This Render?" Diagnostics Drawer:** Real-time inspector explaining the exact reason each component re-rendered.

### 4. Campaign Analytics & Heatmap
- Total reach, interaction totals, and status ratios.
- Platform distribution share.
- 24-hour time-of-day posting cadence heatmap.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

```bash
# Navigate to experiment directory
cd "d:/java/full stack/exp 4"

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will launch at `http://localhost:3000`.

---

## 📁 Project Structure

```
exp 4/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── mockData.ts
│   │   └── platformConfig.ts
│   ├── context/
│   │   ├── PerformanceContext.tsx
│   │   └── PostContext.tsx
│   ├── hooks/
│   │   └── useRenderCounter.ts
│   └── components/
│       ├── Navbar.tsx
│       ├── PerformanceHUD.tsx
│       ├── Filters/
│       │   └── FilterBar.tsx
│       ├── Calendar/
│       │   ├── CalendarHeader.tsx
│       │   ├── CalendarCell.tsx
│       │   ├── MonthView.tsx
│       │   ├── WeekTimeSlot.tsx
│       │   └── WeekView.tsx
│       ├── Post/
│       │   ├── PostCard.tsx
│       │   ├── PostModal.tsx
│       │   └── SocialPreview.tsx
│       ├── Analytics/
│       │   └── AnalyticsView.tsx
│       └── Diagnostics/
│           ├── BenchmarkModal.tsx
│           └── RenderWhyPanel.tsx
```

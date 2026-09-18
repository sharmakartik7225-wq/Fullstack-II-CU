import { format, addDays, subDays } from 'date-fns';
import { Post, PlatformType, PostStatus } from '../types';

export const generateInitialPosts = (): Post[] => {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const dMinus2 = format(subDays(today, 2), 'yyyy-MM-dd');
  const dMinus1 = format(subDays(today, 1), 'yyyy-MM-dd');
  const dPlus1 = format(addDays(today, 1), 'yyyy-MM-dd');
  const dPlus2 = format(addDays(today, 2), 'yyyy-MM-dd');
  const dPlus3 = format(addDays(today, 3), 'yyyy-MM-dd');
  const dPlus4 = format(addDays(today, 4), 'yyyy-MM-dd');
  const dPlus5 = format(addDays(today, 5), 'yyyy-MM-dd');
  const dPlus7 = format(addDays(today, 7), 'yyyy-MM-dd');

  return [
    {
      id: 'task-hw-1',
      title: '📚 Submit Full Stack Lab Experiment 4 Report',
      content: 'Finalize React.memo and useMemo performance benchmark report, attach screenshots of 60 FPS Profiler telemetry, and submit via college LMS portal.',
      platform: 'DailyTask',
      taskCategory: 'Homework',
      taskPriority: 'High',
      scheduledDate: todayStr,
      scheduledTime: '23:59',
      status: 'Scheduled',
      colorTag: 'rose',
      tags: ['#Homework', '#LabReport', '#Exp4', '#FullStack'],
      engagementEstimate: { likes: 0, shares: 0, comments: 0, reach: 1 }
    },
    {
      id: 'task-hw-2',
      title: '💻 Daily Routine: Solve 2 LeetCode Tree Algorithms',
      content: 'Complete Binary Tree Level Order Traversal & Lowest Common Ancestor in TypeScript. Maintain 30-day streak! 🎯',
      platform: 'DailyTask',
      taskCategory: 'DailyRoutine',
      taskPriority: 'Medium',
      scheduledDate: todayStr,
      scheduledTime: '08:00',
      status: 'Published',
      colorTag: 'emerald',
      tags: ['#DailyRoutine', '#DSA', '#TypeScript'],
      engagementEstimate: { likes: 0, shares: 0, comments: 0, reach: 1 }
    },
    {
      id: 'post-1',
      title: '🚀 Launching Antigravity 2.0 AI Assistant',
      content: 'Excited to announce Antigravity 2.0! Built from the ground up for high-performance React architectures, automated code refactoring, and AI-driven dev velocity. Try it out now! #ReactJS #WebDev #AI',
      platform: 'Twitter',
      scheduledDate: todayStr,
      scheduledTime: '09:30',
      status: 'Published',
      colorTag: 'sky',
      tags: ['#ReactJS', '#WebDev', '#AI'],
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      engagementEstimate: { likes: 1420, shares: 380, comments: 95, reach: 24500 }
    },
    {
      id: 'post-2',
      title: 'Deep Dive: React 19 Compiler vs Manual Memoization',
      content: 'Should you still use useMemo and useCallback in React 19? We ran comprehensive benchmarks across 10,000 components to measure memory overhead, render tree stability, and real-world framerates. Read the engineering breakdown.',
      platform: 'LinkedIn',
      scheduledDate: todayStr,
      scheduledTime: '14:30',
      status: 'Scheduled',
      colorTag: 'indigo',
      tags: ['#Performance', '#FrontendArch', '#ReactJS'],
      mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      engagementEstimate: { likes: 890, shares: 210, comments: 64, reach: 18200 }
    },
    {
      id: 'task-hw-3',
      title: '📝 Complete Database Management System Assignment 3',
      content: 'Write SQL queries for B-Tree indexing, complex multi-table joins, and submit ER Diagram documentation to professor before 5 PM.',
      platform: 'DailyTask',
      taskCategory: 'Assignment',
      taskPriority: 'High',
      scheduledDate: dPlus1,
      scheduledTime: '17:00',
      status: 'Scheduled',
      colorTag: 'amber',
      tags: ['#Assignment', '#DBMS', '#SQL'],
      engagementEstimate: { likes: 0, shares: 0, comments: 0, reach: 1 }
    },
    {
      id: 'post-3',
      title: 'Behind the Scenes: Design System 2026',
      content: 'A sneak peek into our sleek dark mode palette, micro-interactions, and accessible Tailwind token architecture. Swipe through to see component anatomy! ✨ #UIUX #DesignSystem #Frontend',
      platform: 'Instagram',
      scheduledDate: dPlus1,
      scheduledTime: '11:00',
      status: 'Scheduled',
      colorTag: 'purple',
      tags: ['#UIUX', '#DesignSystem'],
      mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      engagementEstimate: { likes: 2150, shares: 410, comments: 182, reach: 35000 }
    },
    {
      id: 'task-hw-4',
      title: '⏰ Mini Project Milestone 2 Code Review & Demo Prep',
      content: 'Test all REST endpoints, verify responsiveness across mobile and desktop breakpoints, and rehearse presentation script.',
      platform: 'DailyTask',
      taskCategory: 'Project',
      taskPriority: 'Medium',
      scheduledDate: dPlus2,
      scheduledTime: '15:30',
      status: 'Scheduled',
      colorTag: 'indigo',
      tags: ['#Project', '#Milestone', '#DemoDay'],
      engagementEstimate: { likes: 0, shares: 0, comments: 0, reach: 1 }
    },
    {
      id: 'post-4',
      title: 'Community Livestream: Building Full-Stack Apps with Vite',
      content: 'Join our lead engineers this Thursday at 5 PM PST for a live coding session where we build an end-to-end full stack dashboard with React, Tailwind, and WebSockets. Q&A included!',
      platform: 'Facebook',
      scheduledDate: dPlus2,
      scheduledTime: '17:00',
      status: 'Scheduled',
      colorTag: 'emerald',
      tags: ['#FullStack', '#WebDev', '#Livestream'],
      engagementEstimate: { likes: 520, shares: 89, comments: 43, reach: 8900 }
    },
    {
      id: 'post-5',
      title: 'Quick Tip: Debugging React Re-renders in 30 Seconds',
      content: 'Spotting wasted renders without external extensions: Use React.Profiler or custom useRef counters to highlight DOM nodes on render. Here is a 5-line snippet you can drop into any component! 💡',
      platform: 'Twitter',
      scheduledDate: dPlus3,
      scheduledTime: '10:15',
      status: 'Draft',
      colorTag: 'amber',
      tags: ['#ReactJS', '#Performance', '#TechTips'],
      engagementEstimate: { likes: 670, shares: 190, comments: 28, reach: 14000 }
    },
    {
      id: 'post-6',
      title: 'We are Hiring Senior Frontend Engineers! 🌟',
      content: 'Are you passionate about HCI, web performance, and building developer tools used by millions? Antigravity is expanding its Core Experience team. Fully remote, competitive equity, and flexible culture. Apply today via the link below.',
      platform: 'LinkedIn',
      scheduledDate: dPlus4,
      scheduledTime: '13:00',
      status: 'Draft',
      colorTag: 'rose',
      tags: ['#Hiring', '#TechJobs', '#Frontend'],
      mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      engagementEstimate: { likes: 1100, shares: 340, comments: 88, reach: 29000 }
    },
    {
      id: 'post-7',
      title: 'Weekly Tech Meme: When it builds on first try 🤖',
      content: 'That rare dopamine hit when TypeScript passes, all tests are green, and Vite bundles in 120ms without a single warning. Happy Friday devs! ☕',
      platform: 'Instagram',
      scheduledDate: dPlus5,
      scheduledTime: '16:45',
      status: 'Draft',
      colorTag: 'cyan',
      tags: ['#DevHumor', '#WebDev', '#FridayVibes'],
      mediaUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      engagementEstimate: { likes: 3400, shares: 980, comments: 240, reach: 48000 }
    },
    {
      id: 'post-8',
      title: 'Product Roadmap 2026: What’s Coming Next',
      content: 'We surveyed 10,000 developers and designers. Here is what we are shipping in Q4: 1. AI-powered test generation, 2. Live canvas collaboration, 3. Native desktop companion apps.',
      platform: 'Twitter',
      scheduledDate: dPlus7,
      scheduledTime: '15:00',
      status: 'Draft',
      colorTag: 'sky',
      tags: ['#Roadmap', '#OpenSource', '#ProductDesign'],
      engagementEstimate: { likes: 980, shares: 250, comments: 76, reach: 21000 }
    },
    {
      id: 'post-9',
      title: 'Case Study: Reducing Web Vitals LCP by 68%',
      content: 'How our engineering team audited image pipelines, adopted modern AVIF/WebP formats, and eliminated render-blocking JavaScript to achieve sub-second LCP on mobile.',
      platform: 'LinkedIn',
      scheduledDate: dMinus1,
      scheduledTime: '08:30',
      status: 'Published',
      colorTag: 'indigo',
      tags: ['#Performance', '#WebDev', '#CoreWebVitals'],
      engagementEstimate: { likes: 1840, shares: 430, comments: 112, reach: 38000 }
    },
    {
      id: 'post-10',
      title: 'Monthly Community Spotlight: Top Open Source Contributors',
      content: 'Huge shoutout to the community members who contributed over 250 pull requests this month! Check out the top featured repos in our monthly wrap-up.',
      platform: 'Facebook',
      scheduledDate: dMinus2,
      scheduledTime: '12:00',
      status: 'Published',
      colorTag: 'emerald',
      tags: ['#Community', '#OpenSource'],
      engagementEstimate: { likes: 740, shares: 120, comments: 55, reach: 12500 }
    }
  ];
};

export const generateBulkPosts = (count: number): Post[] => {
  const platforms: PlatformType[] = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'DailyTask'];
  const statuses: PostStatus[] = ['Draft', 'Scheduled', 'Published'];
  const colorTags = ['emerald', 'sky', 'purple', 'rose', 'amber', 'indigo', 'cyan'];
  
  const sampleTitles = [
    '📚 Submit Software Engineering Assignment 4',
    'Exploring Advanced Memoization Patterns in React',
    '📝 Complete Operating Systems Homework & Semaphore Labs',
    'Architecting Scalable Microfrontends with Module Federation',
    '💻 Daily Routine: Solve 3 Graph Algorithm Problems',
    'Why We Replaced Redux with Fine-Grained Signals',
    '⏰ Submit Computer Networks Lab Record & Wireshark Captures',
    'Understanding the React 19 Fiber Reconciliation Engine',
    'Building Accessible Dialogs and Focus Traps',
    '🏃 Daily Habit: Morning Documentation Review'
  ];

  const today = new Date();
  const posts: Post[] = [];

  for (let i = 0; i < count; i++) {
    const dayOffset = (i % 30) - 10;
    const date = addDays(today, dayOffset);
    const dateStr = format(date, 'yyyy-MM-dd');
    const hour = (8 + (i % 14)).toString().padStart(2, '0');
    const min = (i % 2 === 0 ? '00' : '30');
    const platform = platforms[i % platforms.length];
    const status = statuses[i % statuses.length];
    const colorTag = colorTags[i % colorTags.length];
    const titleBase = sampleTitles[i % sampleTitles.length];

    posts.push({
      id: `bulk-post-${i + 1}`,
      title: `${titleBase} #${i + 1}`,
      content: `Scheduled task/post #${i + 1}. Testing render performance and layout stability under heavy stress. #Task #Performance #Activity`,
      platform,
      scheduledDate: dateStr,
      scheduledTime: `${hour}:${min}`,
      status,
      colorTag,
      taskPriority: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low',
      taskCategory: platform === 'DailyTask' ? (i % 2 === 0 ? 'Homework' : 'DailyRoutine') : undefined,
      tags: platform === 'DailyTask' ? ['#Homework', '#Submission', `#Item${i + 1}`] : ['#Performance', '#StressTest', `#Item${i + 1}`],
      engagementEstimate: {
        likes: (i * 17) % 2500 + 50,
        shares: (i * 7) % 600 + 10,
        comments: (i * 3) % 200 + 5,
        reach: (i * 120) % 40000 + 1000
      }
    });
  }

  return posts;
};

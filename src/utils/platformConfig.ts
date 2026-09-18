import { PlatformConfig, PlatformType } from '../types';

export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  Twitter: {
    name: 'Twitter',
    displayName: 'Twitter / X',
    characterLimit: 280,
    brandColor: '#1DA1F2',
    accentColor: 'text-sky-400',
    badgeBg: 'bg-sky-500/15',
    badgeBorder: 'border-sky-500/30',
    badgeText: 'text-sky-300',
    iconName: 'Twitter',
    handle: '@AntigravityHQ',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  LinkedIn: {
    name: 'LinkedIn',
    displayName: 'LinkedIn',
    characterLimit: 3000,
    brandColor: '#0A66C2',
    accentColor: 'text-blue-500',
    badgeBg: 'bg-blue-600/15',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-300',
    iconName: 'Linkedin',
    handle: 'Antigravity Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  Instagram: {
    name: 'Instagram',
    displayName: 'Instagram',
    characterLimit: 2200,
    brandColor: '#E1306C',
    accentColor: 'text-pink-500',
    badgeBg: 'bg-gradient-to-r from-pink-500/15 to-purple-500/15',
    badgeBorder: 'border-pink-500/30',
    badgeText: 'text-pink-300',
    iconName: 'Instagram',
    handle: 'antigravity.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  Facebook: {
    name: 'Facebook',
    displayName: 'Facebook',
    characterLimit: 63206,
    brandColor: '#1877F2',
    accentColor: 'text-indigo-400',
    badgeBg: 'bg-indigo-600/15',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-300',
    iconName: 'Facebook',
    handle: 'Antigravity Tech Community',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
  },
  DailyTask: {
    name: 'DailyTask',
    displayName: 'Daily Routine & Homework',
    characterLimit: 5000,
    brandColor: '#F59E0B',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-gradient-to-r from-amber-500/15 to-orange-500/15',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    iconName: 'BookOpen',
    handle: 'Academic & Daily Activity',
    avatarUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&auto=format&fit=crop&q=80'
  }
};

export const COLOR_TAGS = [
  { id: 'emerald', name: 'Emerald', hex: '#10B981', bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-400', softBg: 'bg-emerald-500/10' },
  { id: 'sky', name: 'Sky Blue', hex: '#0EA5E9', bg: 'bg-sky-500', border: 'border-sky-400', text: 'text-sky-400', softBg: 'bg-sky-500/10' },
  { id: 'purple', name: 'Purple', hex: '#8B5CF6', bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-400', softBg: 'bg-purple-500/10' },
  { id: 'rose', name: 'Rose', hex: '#F43F5E', bg: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-400', softBg: 'bg-rose-500/10' },
  { id: 'amber', name: 'Amber', hex: '#F59E0B', bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-400', softBg: 'bg-amber-500/10' },
  { id: 'indigo', name: 'Indigo', hex: '#6366F1', bg: 'bg-indigo-500', border: 'border-indigo-400', text: 'text-indigo-400', softBg: 'bg-indigo-500/10' },
  { id: 'cyan', name: 'Cyan', hex: '#06B6D4', bg: 'bg-cyan-500', border: 'border-cyan-400', text: 'text-cyan-400', softBg: 'bg-cyan-500/10' }
];

export const POPULAR_HASHTAGS = [
  '#Homework',
  '#Assignment',
  '#LabReport',
  '#StudyRoutine',
  '#ReactJS',
  '#WebDev',
  '#TypeScript',
  '#Performance',
  '#ExamPrep',
  '#DailyGoal'
];

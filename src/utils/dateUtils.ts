import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  subDays,
  parseISO,
  isValid
} from 'date-fns';

export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

export interface TimeSlot {
  hour: number;
  timeString: string; // HH:00
  label: string; // 8:00 AM
}

export const getMonthGrid = (currentDate: Date): CalendarDay[] => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const today = new Date();

  return days.map((date) => ({
    date,
    dateString: format(date, 'yyyy-MM-dd'),
    dayNumber: date.getDate(),
    isCurrentMonth: isSameMonth(date, monthStart),
    isToday: isToday(date),
    isPast: date < today && !isToday(date)
  }));
};

export const getWeekDays = (currentDate: Date): CalendarDay[] => {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const today = new Date();

  return days.map((date) => ({
    date,
    dateString: format(date, 'yyyy-MM-dd'),
    dayNumber: date.getDate(),
    isCurrentMonth: isSameMonth(date, currentDate),
    isToday: isToday(date),
    isPast: date < today && !isToday(date)
  }));
};

export const getTimeSlots = (startHour = 6, endHour = 23): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let h = startHour; h <= endHour; h++) {
    const hourStr = h.toString().padStart(2, '0');
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    slots.push({
      hour: h,
      timeString: `${hourStr}:00`,
      label: `${displayHour}:00 ${period}`
    });
  }
  return slots;
};

export const formatDisplayDate = (dateStr: string): string => {
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, 'MMM d, yyyy') : dateStr;
  } catch {
    return dateStr;
  }
};

export const formatDisplayDateTime = (dateStr: string, timeStr?: string): string => {
  const dateFormatted = formatDisplayDate(dateStr);
  if (!timeStr) return dateFormatted;
  return `${dateFormatted} at ${timeStr}`;
};

export const getRelativeTimeString = (dateStr: string, timeStr?: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    let hour = 12;
    let min = 0;
    if (timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      hour = h;
      min = m;
    }
    const targetDate = new Date(year, month - 1, day, hour, min);
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      if (Math.abs(diffDays) > 0) return `${Math.abs(diffDays)}d ago`;
      return `${Math.abs(diffHours)}h ago`;
    }
    if (diffDays === 0) return `Today at ${timeStr || '12:00'}`;
    if (diffDays === 1) return `Tomorrow at ${timeStr || '12:00'}`;
    if (diffDays < 7) return `In ${diffDays} days`;
    return formatDisplayDate(dateStr);
  } catch {
    return dateStr;
  }
};

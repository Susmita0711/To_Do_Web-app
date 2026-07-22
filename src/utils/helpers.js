import { format, formatDistanceToNow, isToday, isTomorrow, isPast, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d, yyyy');
};

export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

export const formatDateTime = (date, time) => {
  const dateStr = formatDate(date);
  const timeStr = formatTime(time);
  if (!dateStr && !timeStr) return '';
  if (dateStr && timeStr) return `${dateStr} at ${timeStr}`;
  return dateStr || timeStr;
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const isOverdue = (dueDate, dueTime) => {
  if (!dueDate) return false;
  const dateStr = dueDate + (dueTime ? `T${dueTime}` : 'T23:59:59');
  return isPast(parseISO(dateStr));
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

export const getWeekDays = () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const isDueThisWeek = (date) => {
  if (!date) return false;
  const d = parseISO(date);
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return d >= start && d <= end;
};

export const isDueToday = (date) => {
  if (!date) return false;
  return isToday(parseISO(date));
};

export const calculateProductivity = (tasks) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
};

export const getTasksByCategory = (tasks) => {
  const map = {};
  tasks.forEach(t => {
    const cat = t.category || 'Uncategorized';
    map[cat] = (map[cat] || 0) + 1;
  });
  return map;
};

export const getTasksByPriority = (tasks) => {
  const map = { High: 0, Medium: 0, Low: 0 };
  tasks.forEach(t => {
    map[t.priority] = (map[t.priority] || 0) + 1;
  });
  return map;
};

export const getWeeklyCompletionData = (tasks) => {
  const days = getWeekDays();
  return days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return {
      day: format(day, 'EEE'),
      date: dayStr,
      completed: tasks.filter(t =>
        t.completed && t.completedAt && format(parseISO(t.completedAt), 'yyyy-MM-dd') === dayStr
      ).length,
      created: tasks.filter(t =>
        format(parseISO(t.createdAt), 'yyyy-MM-dd') === dayStr
      ).length,
    };
  });
};

export const searchTasks = (tasks, query) => {
  if (!query.trim()) return tasks;
  const q = query.toLowerCase();
  return tasks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    (t.description && t.description.toLowerCase().includes(q)) ||
    (t.category && t.category.toLowerCase().includes(q)) ||
    (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
  );
};

export const highlightText = (text, query) => {
  if (!query.trim() || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts;
};

export const exportToJSON = (tasks, settings) => {
  return JSON.stringify({ tasks, settings, exportDate: new Date().toISOString() }, null, 2);
};

export const createTask = (data) => ({
  id: generateId(),
  title: data.title || '',
  description: data.description || '',
  dueDate: data.dueDate || '',
  dueTime: data.dueTime || '',
  priority: data.priority || 'Medium',
  category: data.category || 'Personal',
  colorLabel: data.colorLabel || '#6366F1',
  tags: data.tags || [],
  reminder: data.reminder || false,
  completed: false,
  pinned: false,
  archived: false,
  progress: 0,
  createdAt: new Date().toISOString(),
  completedAt: null,
});

export const CATEGORIES = [
  'Work', 'Study', 'Personal', 'Shopping', 'Fitness', 'Finance', 'Travel'
];

export const PRIORITY_LEVELS = ['High', 'Medium', 'Low'];

export const COLOR_LABELS = [
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Emerald', value: '#22C55E' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Rose', value: '#EF4444' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Orange', value: '#F97316' },
];

export const MOTIVATIONAL_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
];

export const ACHIEVEMENTS = [
  { id: 'first_task', name: 'Getting Started', desc: 'Created your first task', icon: '🎯' },
  { id: 'ten_tasks', name: 'On a Roll', desc: 'Created 10 tasks', icon: '🔥' },
  { id: 'first_complete', name: 'First Win', desc: 'Completed your first task', icon: '✅' },
  { id: 'ten_complete', name: 'Task Master', desc: 'Completed 10 tasks', icon: '🏆' },
  { id: 'week_streak', name: 'Weekly Warrior', desc: '7-day productivity streak', icon: '⚡' },
  { id: 'early_bird', name: 'Early Bird', desc: 'Completed a task before 9 AM', icon: '🐦' },
  { id: 'night_owl', name: 'Night Owl', desc: 'Completed a task after 10 PM', icon: '🦉' },
  { id: 'productive_day', name: 'Super Productive', desc: 'Completed 5+ tasks in a day', icon: '💎' },
];

export const FILTER_OPTIONS = [
  { label: 'All Tasks', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: "Today's Tasks", value: 'today' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'High Priority', value: 'high' },
  { label: 'Medium Priority', value: 'medium' },
  { label: 'Low Priority', value: 'low' },
  { label: 'Pinned', value: 'pinned' },
  { label: 'Archived', value: 'archived' },
];

export const SORT_OPTIONS = [
  { label: 'Recently Added', value: 'createdAt' },
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'Name', value: 'title' },
  { label: 'Category', value: 'category' },
  { label: 'Completion', value: 'completed' },
];

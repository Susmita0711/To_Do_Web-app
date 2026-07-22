import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { getTasksByCategory, getTasksByPriority, getWeeklyCompletionData, calculateProductivity } from '../utils/helpers';
import CircularProgress from '../components/ui/CircularProgress';
import { Target, Calendar, TrendingUp, Award } from 'lucide-react';

export default function StatisticsPage() {
  const { tasks, achievements, streak, settings } = useTasks();

  const stats = useMemo(() => {
    const activeTasks = tasks.filter(t => !t.archived);
    const completed = activeTasks.filter(t => t.completed);
    const today = new Date().toDateString();
    const completedToday = completed.filter(t => t.completedAt && new Date(t.completedAt).toDateString() === today).length;
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const completedThisWeek = completed.filter(t => t.completedAt && new Date(t.completedAt) >= weekStart).length;
    const categoryData = getTasksByCategory(activeTasks);
    const priorityData = getTasksByPriority(activeTasks);
    const weeklyData = getWeeklyCompletionData(activeTasks);
    const productivity = calculateProductivity(activeTasks);
    const maxWeekly = Math.max(...weeklyData.map(d => d.completed), 1);

    return { total: activeTasks.length, completedToday, completedThisWeek, productivity, categoryData, priorityData, weeklyData, maxWeekly };
  }, [tasks]);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Statistics</h1>
        <p className="text-sm text-text-secondary mt-1">Your productivity insights</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Total Tasks', value: stats.total, color: '#6366F1' },
          { icon: Calendar, label: 'Completed Today', value: stats.completedToday, color: '#22C55E' },
          { icon: TrendingUp, label: 'This Week', value: stats.completedThisWeek, color: '#8B5CF6' },
          { icon: Award, label: 'Day Streak', value: streak.count, color: '#F59E0B' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-5">
            <item.icon className="w-5 h-5 mb-3" style={{ color: item.color }} />
            <p className="text-2xl font-bold text-text-primary">{item.value}</p>
            <p className="text-xs text-text-secondary">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Weekly Activity</h3>
          <div className="flex items-end gap-2 h-40">
            {stats.weeklyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.completed / stats.maxWeekly) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary to-accent min-h-[4px]"
                />
                <span className="text-[10px] text-text-muted">{day.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Productivity Score</h3>
          <div className="flex justify-center">
            <CircularProgress value={stats.productivity} size={160} strokeWidth={10} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">By Category</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryData).map(([cat, count], i) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-xs font-medium text-text-secondary w-20 truncate">{cat}</span>
                <div className="flex-1 h-2.5 rounded-full bg-surface-dim overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / stats.total) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
                <span className="text-xs font-bold text-text-primary w-8 text-right">{count}</span>
              </div>
            ))}
            {Object.keys(stats.categoryData).length === 0 && (
              <p className="text-sm text-text-muted text-center py-4">No data yet</p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">By Priority</h3>
          <div className="space-y-4">
            {[
              { label: 'High', count: stats.priorityData.High, color: '#EF4444' },
              { label: 'Medium', count: stats.priorityData.Medium, color: '#F59E0B' },
              { label: 'Low', count: stats.priorityData.Low, color: '#22C55E' },
            ].map((p, i) => (
              <div key={p.label} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                <span className="text-xs font-medium text-text-secondary flex-1">{p.label}</span>
                <div className="w-32 h-2 rounded-full bg-surface-dim overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.total ? (p.count / stats.total) * 100 : 0}%` }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: p.color }}
                  />
                </div>
                <span className="text-xs font-bold text-text-primary w-8 text-right">{p.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'first_task', name: 'Getting Started', icon: '🎯', desc: 'Created first task' },
            { id: 'ten_tasks', name: 'On a Roll', icon: '🔥', desc: 'Created 10 tasks' },
            { id: 'first_complete', name: 'First Win', icon: '✅', desc: 'Completed first task' },
            { id: 'ten_complete', name: 'Task Master', icon: '🏆', desc: 'Completed 10 tasks' },
            { id: 'week_streak', name: 'Weekly Warrior', icon: '⚡', desc: '7-day streak' },
            { id: 'early_bird', name: 'Early Bird', icon: '🐦', desc: 'Before 9 AM' },
            { id: 'night_owl', name: 'Night Owl', icon: '🦉', desc: 'After 10 PM' },
            { id: 'productive_day', name: 'Super Productive', icon: '💎', desc: '5+ in a day' },
          ].map(a => {
            const unlocked = achievements.includes(a.id);
            return (
              <motion.div key={a.id} whileHover={{ scale: 1.03 }}
                className={`p-4 rounded-xl text-center transition ${unlocked ? 'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20' : 'bg-surface-dim opacity-50'}`}>
                <div className="text-3xl mb-2">{a.icon}</div>
                <p className="text-xs font-bold text-text-primary">{a.name}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{a.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

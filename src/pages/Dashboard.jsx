import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { calculateProductivity, isDueToday, isOverdue } from '../utils/helpers';
import StatsCard from '../components/ui/StatsCard';
import CircularProgress from '../components/ui/CircularProgress';
import PomodoroTimer from '../components/productivity/PomodoroTimer';
import DailyQuote from '../components/productivity/DailyQuote';
import TaskList from '../components/tasks/TaskList';
import {
  ListChecks, CheckCircle2, Clock, AlertTriangle,
  Target, TrendingUp
} from 'lucide-react';

export default function Dashboard({ onEditTask }) {
  const { tasks, todayCompletedCount, settings } = useTasks();

  const stats = useMemo(() => {
    const active = tasks.filter(t => !t.completed && !t.archived);
    const completed = tasks.filter(t => t.completed && !t.archived);
    const high = tasks.filter(t => t.priority === 'High' && !t.completed && !t.archived);
    const today = tasks.filter(t => isDueToday(t.dueDate) && !t.archived);
    const overdue = tasks.filter(t => isOverdue(t.dueDate, t.dueTime) && !t.completed && !t.archived);
    const productivity = calculateProductivity(tasks.filter(t => !t.archived));

    return {
      total: tasks.filter(t => !t.archived).length,
      completed: completed.length,
      pending: active.length,
      high: high.length,
      today: today.length,
      overdue: overdue.length,
      productivity,
    };
  }, [tasks]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Your productivity at a glance</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <StatsCard icon={ListChecks} label="Total Tasks" value={stats.total} color="#6366F1" delay={0} />
        <StatsCard icon={CheckCircle2} label="Completed" value={stats.completed} color="#22C55E" delay={0.05} />
        <StatsCard icon={Clock} label="Pending" value={stats.pending} color="#F59E0B" delay={0.1} />
        <StatsCard icon={AlertTriangle} label="High Priority" value={stats.high} color="#EF4444" delay={0.15} />
        <StatsCard icon={Target} label="Today's Tasks" value={stats.today} color="#8B5CF6" delay={0.2} />
        <StatsCard icon={TrendingUp} label="Overdue" value={stats.overdue} color="#F97316" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PomodoroTimer />
        <DailyQuote />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary">Recent Tasks</h2>
              <span className="text-xs text-text-muted">Last 5 tasks</span>
            </div>
            <TaskList
              filter="all"
              showFilters={false}
              onEditTask={onEditTask}
              emptyTitle="No tasks yet"
              emptySubtitle="Create your first task to see it here"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">Productivity</h3>
          <div className="flex justify-center">
            <CircularProgress value={stats.productivity} size={140} label="Score" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="text-center p-3 rounded-xl bg-surface-dim">
              <p className="text-lg font-bold text-text-primary">{todayCompletedCount}</p>
              <p className="text-[10px] text-text-muted">Done Today</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-surface-dim">
              <p className="text-lg font-bold text-text-primary">{settings.dailyGoal}</p>
              <p className="text-[10px] text-text-muted">Daily Goal</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

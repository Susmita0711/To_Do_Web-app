import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getTasksForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(t => t.dueDate === dateStr && !t.archived);
  };

  const selectedTasks = getTasksForDate(selectedDate);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Calendar</h1>
        <p className="text-sm text-text-secondary mt-1">View your tasks by date</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text-primary">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                className="p-2 rounded-lg hover:bg-primary/10 transition">
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentMonth(new Date())}
                className="btn-ghost text-xs py-1.5 px-3">Today</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                className="p-2 rounded-lg hover:bg-primary/10 transition">
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-text-muted py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const dayTasks = getTasksForDate(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(day)}
                  className={`relative aspect-square rounded-xl p-1 flex flex-col items-center justify-center transition-all ${
                    isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                    isTodayDate ? 'bg-primary/10 text-primary font-bold' :
                    isCurrentMonth ? 'hover:bg-surface-dim text-text-primary' :
                    'text-text-muted/40'
                  }`}
                >
                  <span className="text-sm">{format(day, 'd')}</span>
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayTasks.slice(0, 3).map((t, j) => (
                        <div key={j} className="w-1 h-1 rounded-full" style={{ background: t.colorLabel }} />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No tasks for this day</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-dim"
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: task.colorLabel }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                    <p className="text-xs text-text-muted">{task.category} · {task.priority}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

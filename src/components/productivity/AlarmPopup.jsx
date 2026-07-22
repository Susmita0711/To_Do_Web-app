import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Clock } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';

export default function AlarmPopup({ alarms, onDismiss }) {
  const { completeTask } = useTasks();
  const { addToast } = useToast();

  const handleComplete = (task) => {
    completeTask(task.id);
    addToast('Task completed!', 'success');
    onDismiss(task.id + '-' + task.dueDate + '-' + task.dueTime);
  };

  return (
    <div className="fixed top-20 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {alarms.map(alarm => (
          <motion.div
            key={alarm.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto rounded-2xl overflow-hidden shadow-2xl border border-white/30"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.95), rgba(139,92,246,0.95))',
            }}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0"
                >
                  <Bell className="w-5 h-5 text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/70 mb-0.5">Time's up!</p>
                  <p className="text-sm font-bold text-white truncate">{alarm.task.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-3 h-3 text-white/60" />
                    <span className="text-[10px] text-white/60">
                      {alarm.task.dueTime} · {alarm.task.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDismiss(alarm.id)}
                  className="p-1 rounded-lg hover:bg-white/20 transition shrink-0"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleComplete(alarm.task)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition"
                >
                  <Check className="w-3.5 h-3.5" /> Mark Done
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDismiss(alarm.id)}
                  className="flex-1 py-2 rounded-xl bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 transition"
                >
                  Dismiss
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 10, ease: 'linear' }}
              className="h-0.5 bg-white/40 origin-left"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

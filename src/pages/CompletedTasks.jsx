import { motion } from 'framer-motion';
import TaskList from '../components/tasks/TaskList';
import { CheckCircle2 } from 'lucide-react';

export default function CompletedTasks({ onEditTask }) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Completed Tasks</h1>
            <p className="text-sm text-text-secondary">Great job on these accomplishments</p>
          </div>
        </div>
      </motion.div>
      <TaskList filter="completed" onEditTask={onEditTask} />
    </div>
  );
}

import { motion } from 'framer-motion';
import TaskList from '../components/tasks/TaskList';
import { Archive } from 'lucide-react';

export default function ArchivePage({ onEditTask }) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Archive className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Archive</h1>
            <p className="text-sm text-text-secondary">Your archived tasks</p>
          </div>
        </div>
      </motion.div>
      <TaskList filter="archived" onEditTask={onEditTask} />
    </div>
  );
}

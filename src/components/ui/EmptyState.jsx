import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';

export default function EmptyState({ icon: Icon = ClipboardList, title = 'No tasks yet', subtitle = 'Create your first task to get started' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6"
      >
        <Icon className="w-10 h-10 text-primary" />
      </motion.div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary text-center max-w-sm">{subtitle}</p>
    </motion.div>
  );
}

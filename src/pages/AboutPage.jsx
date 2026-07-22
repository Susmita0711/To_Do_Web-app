import { motion } from 'framer-motion';
import { Zap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl animated-gradient-bg flex items-center justify-center mx-auto mb-6"
        >
          <Zap className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold gradient-text">FlowDo</h1>
        <p className="text-text-secondary mt-2">Premium Productivity App</p>
        <p className="text-sm text-text-muted mt-1">Version 1.0.0</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Drag & Drop Reordering', 'Dark & Light Mode', 'Pomodoro Timer',
            'Calendar View', 'Statistics & Analytics', 'Achievement System',
            'Keyboard Shortcuts', 'Search & Filters', 'Import/Export Data',
            'Motivational Quotes', 'Task Categories & Tags', 'Responsive Design',
          ].map((feature, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 text-sm text-text-secondary">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {feature}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Lucide Icons', 'dnd-kit', 'date-fns'].map(tech => (
            <span key={tech} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-6 text-center">
        <p className="text-sm text-text-secondary">
          Built with <Heart className="w-4 h-4 inline text-danger fill-danger" /> using modern web technologies
        </p>
        <p className="text-xs text-text-muted mt-2">© 2026 FlowDo. All rights reserved.</p>
      </motion.div>
    </div>
  );
}

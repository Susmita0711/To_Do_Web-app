import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface">
      <div className="fixed inset-0 -z-10 animated-gradient-bg opacity-[0.03]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          className="w-16 h-16 rounded-2xl animated-gradient-bg flex items-center justify-center shadow-lg"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Zap className="w-8 h-8 text-white" />
        </motion.div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold gradient-text">FlowDo</h2>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

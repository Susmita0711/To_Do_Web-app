import { motion } from 'framer-motion';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function StatsCard({ icon: Icon, label, value, color = '#6366F1', trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card p-5 relative overflow-hidden group cursor-default"
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8 transition-transform group-hover:scale-125"
        style={{ background: color }}
      />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend > 0 ? 'text-success bg-success/10' : 'text-danger bg-danger/10'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <AnimatedCounter
          value={typeof value === 'number' ? value : 0}
          className="text-3xl font-bold text-text-primary"
        />
        <p className="text-sm text-text-secondary mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

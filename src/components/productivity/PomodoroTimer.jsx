import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

export default function PomodoroTimer() {
  const [mode, setMode] = useState('work'); // work | break
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'work') {
        setSessions(s => s + 1);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, mode]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => { setIsRunning(false); setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60); };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        {mode === 'work' ? <Brain className="w-5 h-5 text-primary" /> : <Coffee className="w-5 h-5 text-success" />}
        <h3 className="text-sm font-semibold text-text-primary">
          {mode === 'work' ? 'Focus Time' : 'Break Time'}
        </h3>
      </div>

      <div className="relative inline-flex items-center justify-center mb-6">
        <svg width="200" height="200" className="-rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="6"
            className="text-border" />
          <motion.circle
            cx="100" cy="100" r="90" fill="none"
            stroke={mode === 'work' ? '#6366F1' : '#22C55E'}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-mono text-text-primary">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-text-muted mt-1">{sessions} sessions completed</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={toggle}
          className="btn-primary px-6"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="btn-ghost px-4"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

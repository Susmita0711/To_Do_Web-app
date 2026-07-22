import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOTIVATIONAL_QUOTES } from '../../utils/constants';
import { RefreshCw, Quote } from 'lucide-react';

export default function DailyQuote() {
  const [quote, setQuote] = useState(() => {
    const today = new Date().getDate();
    return MOTIVATIONAL_QUOTES[today % MOTIVATIONAL_QUOTES.length];
  });

  const refresh = () => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[idx]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 opacity-10">
        <Quote className="w-16 h-16 text-primary" />
      </div>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          Daily Inspiration
        </span>
        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={refresh}
          className="p-1.5 rounded-lg hover:bg-primary/10 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-text-secondary" />
        </motion.button>
      </div>
      <p className="text-sm font-medium text-text-primary leading-relaxed mb-2">
        "{quote.text}"
      </p>
      <p className="text-xs text-text-secondary">— {quote.author}</p>
    </motion.div>
  );
}

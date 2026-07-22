import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl font-black gradient-text mb-4"
        >
          404
        </motion.div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Page Not Found</h2>
        <p className="text-sm text-text-secondary mb-6">The page you're looking for doesn't exist</p>
        <div className="flex gap-3 justify-center">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')} className="btn-primary">
            <Home className="w-4 h-4" /> Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { useClock } from '../../hooks/useClock';
import { getGreeting, searchTasks } from '../../utils/helpers';
import { Menu, Search, Bell, Plus, X, User } from 'lucide-react';

export default function Header({ onMenuToggle, onNewTask }) {
  const { tasks } = useTasks();
  const { user, userProfile } = useAuth();
  const clock = useClock();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const results = searchQuery ? searchTasks(tasks.filter(t => !t.archived), searchQuery).slice(0, 5) : [];

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleResultClick = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const displayName = userProfile?.name || user?.displayName || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const photoURL = userProfile?.photoURL || user?.photoURL;

  return (
    <header className="glass sticky top-0 z-30 border-b border-white/20">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-black/5 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-sm text-text-secondary">
              {getGreeting()}, {displayName.split(' ')[0]} 👋
            </p>
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-muted">{clock.date}</p>
              <span className="text-xs font-mono font-medium text-primary">{clock.formatted}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search tasks... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field text-sm pr-8"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 w-full glass-card rounded-xl overflow-hidden shadow-xl z-50"
                  >
                    {results.map(task => (
                      <button
                        key={task.id}
                        onClick={handleResultClick}
                        className="w-full px-4 py-3 text-left hover:bg-primary/5 transition flex items-center gap-3 border-b border-border/50 last:border-0"
                      >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: task.colorLabel }} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <p className="text-xs text-text-muted">{task.category}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!searchOpen && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-black/5 transition"
              title="Search (⌘K)"
            >
              <Search className="w-[18px] h-[18px] text-text-secondary" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl hover:bg-black/5 transition relative"
            title="Notifications"
          >
            <Bell className="w-[18px] h-[18px] text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewTask}
            className="hidden sm:flex btn-primary text-sm py-2.5 px-4"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">New Task</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewTask}
            className="sm:hidden p-2.5 rounded-xl bg-primary text-white"
          >
            <Plus className="w-[18px] h-[18px]" />
          </motion.button>

          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary/30 transition"
          >
            {photoURL ? (
              <img src={photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-white">{initials}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

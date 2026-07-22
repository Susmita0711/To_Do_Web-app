import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, CalendarDays, CheckCircle2, Archive,
  BarChart3, Settings, Clock, Sun, X,
  Trophy, Zap, User
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/today', icon: Clock, label: 'Today' },
  { to: '/upcoming', icon: CalendarDays, label: 'Upcoming' },
  { to: '/completed', icon: CheckCircle2, label: 'Completed' },
  { to: '/archive', icon: Archive, label: 'Archive' },
  { to: '/statistics', icon: BarChart3, label: 'Statistics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { tasks, todayCompletedCount, streak, settings } = useTasks();
  const { user, userProfile } = useAuth();

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 glass flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:transition-none`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl animated-gradient-bg flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.05 }}
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold gradient-text">FlowDo</h1>
              <p className="text-[11px] text-text-secondary">Premium Productivity</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-black/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
              {item.to === '/' && (
                <span className="ml-auto text-xs font-medium text-text-muted">
                  {tasks.filter(t => !t.completed && !t.archived).length}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-2">
            <NavLink
              to="/profile"
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <div className="w-[18px] h-[18px] rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-primary/10">
                {userProfile?.photoURL || user?.photoURL ? (
                  <img src={userProfile?.photoURL || user?.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3 h-3 text-primary" />
                )}
              </div>
              <span>Profile</span>
              {user && !user.emailVerified && (
                <span className="ml-auto text-[10px] font-medium text-warning bg-warning/10 px-1.5 py-0.5 rounded-full">
                  Unverified
                </span>
              )}
            </NavLink>
          </div>
        </nav>

        <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Daily Progress</p>
              <p className="text-xs text-text-secondary">
                {todayCompletedCount}/{settings.dailyGoal} tasks
              </p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-white overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((todayCompletedCount / (settings.dailyGoal || 1)) * 100, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Sun className="w-4 h-4 text-warning" />
            <span className="text-xs font-medium text-text-secondary">
              {streak.count} day streak
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

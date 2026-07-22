import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { COLOR_LABELS } from '../utils/constants';
import {
  User, Mail, Camera, Save, LogOut, Shield, Target,
  Calendar, Trophy, Trash2, X, Zap
} from 'lucide-react';

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile, logout } = useAuth();
  const { accentColor, setAccentColor } = useTheme();
  const { tasks, settings, updateSettings, achievements, streak } = useTasks();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [name, setName] = useState(userProfile?.name || user?.displayName || '');
  const [photoPreview, setPhotoPreview] = useState(userProfile?.photoURL || user?.photoURL || '');
  const [saving, setSaving] = useState(false);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('Image must be under 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        name,
        photoURL: photoPreview,
        accentColor,
        dailyGoal: settings.dailyGoal,
        weeklyGoal: settings.weeklyGoal,
        fontSize: settings.fontSize,
        animations: settings.animations,
        notifications: settings.notifications,
      });
      addToast('Profile updated', 'success');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const joinDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Profile</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your account</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-full border-3 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition overflow-hidden bg-surface-dim"
            >
              {photoPreview ? (
                <img src={photoPreview} className="w-full h-full object-cover" alt="" />
              ) : (
                <User className="w-10 h-10 text-text-muted" />
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-dark transition"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-text-primary">{name || 'User'}</h2>
            <p className="text-sm text-text-secondary flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
            <p className="text-xs text-text-muted mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Member since {joinDate}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Tasks', value: totalTasks, icon: Target, color: 'primary' },
          { label: 'Completed', value: completedTasks, icon: Trophy, color: 'success' },
          { label: 'Streak', value: `${streak.count}d`, icon: Zap, color: 'warning' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}`} />
            </div>
            <p className="text-lg font-bold text-text-primary">{stat.value}</p>
            <p className="text-[10px] text-text-muted">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Edit Profile</h3>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Display Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-3 block">Accent Color</label>
          <div className="flex gap-3 flex-wrap">
            {COLOR_LABELS.map(c => (
              <motion.button
                key={c.value}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAccentColor(c.value)}
                className={`w-9 h-9 rounded-full transition-all ${
                  accentColor === c.value
                    ? 'ring-3 ring-offset-2 ring-primary shadow-lg'
                    : 'ring-1 ring-black/5 hover:ring-primary/30'
                }`}
                style={{ background: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Daily Goal</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={20}
              value={settings.dailyGoal}
              onChange={e => updateSettings({ dailyGoal: parseInt(e.target.value) })}
              className="flex-1 accent-[var(--color-primary)]"
            />
            <span className="text-sm font-bold text-primary w-8 text-right">{settings.dailyGoal}</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-3 block">Achievements</label>
          <div className="flex flex-wrap gap-2">
            {achievements.length === 0 && (
              <p className="text-xs text-text-muted">No achievements yet</p>
            )}
            {achievements.map(id => {
              const a = { first_task: { name: 'Getting Started', icon: '🎯' }, ten_tasks: { name: 'On a Roll', icon: '🔥' }, first_complete: { name: 'First Win', icon: '✅' }, ten_complete: { name: 'Task Master', icon: '🏆' }, week_streak: { name: 'Weekly Warrior', icon: '⚡' }, early_bird: { name: 'Early Bird', icon: '🐦' }, night_owl: { name: 'Night Owl', icon: '🦉' }, productive_day: { name: 'Super Productive', icon: '💎' } };
              const ach = a[id];
              if (!ach) return null;
              return (
                <div key={id} className="px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary flex items-center gap-1">
                  <span>{ach.icon}</span> {ach.name}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-3">
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary flex-1 justify-center py-3 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </motion.button>

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-ghost py-3 px-6 text-danger hover:bg-danger/10"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
}

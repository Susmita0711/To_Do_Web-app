import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { exportToJSON } from '../utils/helpers';
import { COLOR_LABELS } from '../utils/constants';
import {
  Palette, Type, Bell, Download,
  Upload, RotateCcw, CheckCircle, AlertTriangle, Sun
} from 'lucide-react';
import Modal from '../components/ui/Modal';

export default function SettingsPage() {
  const { accentColor, setAccentColor } = useTheme();
  const { settings, updateSettings, resetApp, importData, tasks, categories, allTags, achievements, streak } = useTasks();
  const { addToast } = useToast();
  const [showReset, setShowReset] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = exportToJSON(tasks, {
      settings, categories, allTags, achievements, streak,
      accentColor,
    });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowdo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Data exported successfully', 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        importData(data);
        if (data.accentColor) setAccentColor(data.accentColor);
        addToast('Data imported successfully', 'success');
      } catch {
        addToast('Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    resetApp();
    setShowReset(false);
    addToast('App data reset', 'warning');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Customize your experience</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-6">
        <Section title="Appearance">
          <p className="text-xs text-text-muted mb-3">Choose your accent color</p>
          <div className="flex gap-3 flex-wrap">
            {COLOR_LABELS.map(c => (
              <motion.button
                key={c.value}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAccentColor(c.value)}
                className={`w-10 h-10 rounded-full transition-all ${
                  accentColor === c.value
                    ? 'ring-3 ring-offset-2 ring-primary shadow-lg'
                    : 'ring-1 ring-black/5 hover:ring-primary/30'
                }`}
                style={{ background: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </Section>

        <Section title="Preferences">
          <Row
            icon={Type}
            label="Font Size"
            action={
              <select value={settings.fontSize} onChange={e => updateSettings({ fontSize: e.target.value })}
                className="input-field py-1.5 px-3 text-xs w-auto">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            }
          />
          <Row
            icon={Sun}
            label="Animations"
            action={<Toggle checked={settings.animations} onChange={() => updateSettings({ animations: !settings.animations })} />}
          />
          <Row
            icon={Bell}
            label="Alarm Notifications"
            action={<Toggle checked={settings.notifications} onChange={() => updateSettings({ notifications: !settings.notifications })} />}
          />
          <Row
            icon={CheckCircle}
            label="Daily Goal"
            action={
              <div className="flex items-center gap-2">
                <input type="range" min={1} max={20} value={settings.dailyGoal}
                  onChange={e => updateSettings({ dailyGoal: parseInt(e.target.value) })}
                  className="w-24 accent-[var(--color-primary)]" />
                <span className="text-xs font-bold text-primary w-6 text-right">{settings.dailyGoal}</span>
              </div>
            }
          />
          <Row
            icon={CheckCircle}
            label="Weekly Goal"
            action={
              <div className="flex items-center gap-2">
                <input type="range" min={1} max={100} value={settings.weeklyGoal}
                  onChange={e => updateSettings({ weeklyGoal: parseInt(e.target.value) })}
                  className="w-24 accent-[var(--color-primary)]" />
                <span className="text-xs font-bold text-primary w-8 text-right">{settings.weeklyGoal}</span>
              </div>
            }
          />
        </Section>

        <Section title="Data Management">
          <Row
            icon={Download}
            label="Export Backup"
            desc="Download all your data as JSON"
            action={
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleExport} className="btn-ghost text-xs py-2 px-4">
                <Download className="w-3.5 h-3.5" /> Export
              </motion.button>
            }
          />
          <Row
            icon={Upload}
            label="Import Backup"
            desc="Restore data from a JSON file"
            action={
              <>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => fileInputRef.current?.click()} className="btn-ghost text-xs py-2 px-4">
                  <Upload className="w-3.5 h-3.5" /> Import
                </motion.button>
              </>
            }
          />
          <div className="h-px bg-border my-1" />
          <Row
            icon={RotateCcw}
            label="Reset App"
            desc="Permanently delete all data"
            action={
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowReset(true)} className="btn-ghost text-xs py-2 px-4 text-danger hover:bg-danger/10">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </motion.button>
            }
          />
        </Section>
      </motion.div>

      <Modal isOpen={showReset} onClose={() => setShowReset(false)} title="Reset All Data" size="sm">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
          <p className="text-sm text-text-secondary mb-6">
            This will permanently delete all your tasks, categories, and settings. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowReset(false)} className="btn-ghost flex-1">Cancel</button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl bg-danger text-white font-semibold text-sm">
              Reset Everything
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, desc, action }) {
  return (
    <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-surface-dim transition gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="w-4 h-4 text-text-secondary shrink-0" />
        <div className="min-w-0">
          <span className="text-sm font-medium text-text-primary block">{label}</span>
          {desc && <span className="text-[10px] text-text-muted block">{desc}</span>}
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={onChange} className="relative">
      <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`}>
        <motion.div className="w-4 h-4 rounded-full bg-white shadow"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}

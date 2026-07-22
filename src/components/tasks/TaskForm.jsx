import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import { COLOR_LABELS, PRIORITY_LEVELS } from '../../utils/constants';
import { X, Plus, Tag } from 'lucide-react';
import Modal from '../ui/Modal';

export default function TaskForm({ isOpen, onClose, editTask = null }) {
  const { addTask, updateTask, categories } = useTasks();
  const { addToast } = useToast();
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'Medium',
    category: 'Personal',
    colorLabel: '#6366F1',
    tags: [],
    reminder: false,
  });

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        dueDate: editTask.dueDate || '',
        dueTime: editTask.dueTime || '',
        priority: editTask.priority || 'Medium',
        category: editTask.category || 'Personal',
        colorLabel: editTask.colorLabel || '#6366F1',
        tags: editTask.tags || [],
        reminder: editTask.reminder || false,
      });
    } else {
      setForm({
        title: '', description: '', dueDate: '', dueTime: '',
        priority: 'Medium', category: 'Personal', colorLabel: '#6366F1',
        tags: [], reminder: false,
      });
    }
  }, [editTask, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      addToast('Please enter a task title', 'error');
      return;
    }
    if (editTask) {
      updateTask(editTask.id, form);
      addToast('Task updated successfully', 'success');
    } else {
      addTask(form);
      addToast('Task created successfully', 'success');
    }
    onClose();
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editTask ? 'Edit Task' : 'New Task'} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="What needs to be done?"
            className="input-field"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Add some details..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Due Time</label>
            <input
              type="time"
              value={form.dueTime}
              onChange={e => setForm(f => ({ ...f, dueTime: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Priority</label>
            <div className="flex gap-2">
              {PRIORITY_LEVELS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, priority: p }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    form.priority === p
                      ? p === 'High' ? 'bg-danger text-white shadow-lg shadow-danger/30'
                        : p === 'Medium' ? 'bg-warning text-white shadow-lg shadow-warning/30'
                        : 'bg-success text-white shadow-lg shadow-success/30'
                      : 'bg-surface-dim text-text-secondary hover:bg-surface'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="input-field"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Color Label</label>
          <div className="flex gap-2">
            {COLOR_LABELS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, colorLabel: c.value }))}
                className={`w-8 h-8 rounded-full transition-all ${form.colorLabel === c.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'}`}
                style={{ background: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag..."
              className="input-field flex-1"
            />
            <button type="button" onClick={addTag} className="btn-primary py-2">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tags.map(tag => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.reminder}
                onChange={e => setForm(f => ({ ...f, reminder: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-10 h-5 rounded-full bg-gray-300 peer-checked:bg-primary transition-colors" />
              <motion.div
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow"
                animate={{ x: form.reminder ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
            <span className="text-sm font-medium text-text-secondary">Set Reminder</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
            Cancel
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex-1 justify-center"
          >
            {editTask ? 'Update Task' : 'Create Task'}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}

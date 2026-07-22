import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatTime } from '../../utils/helpers';
import {
  Check, Pencil, Trash2, Copy, Pin, Archive, MoreHorizontal,
  Calendar, Clock, Tag, Flag, RotateCcw
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ task, onEdit, index = 0 }) {
  const { completeTask, deleteTask, pinTask, archiveTask, duplicateTask } = useTasks();
  const { addToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    High: 'priority-high',
    Medium: 'priority-medium',
    Low: 'priority-low',
  };

  const positionMenu = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.right - 192 });
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    positionMenu();

    const handleClickOutside = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        const menu = document.getElementById('task-context-menu');
        if (menu && !menu.contains(e.target)) {
          setMenuOpen(false);
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    const handleScroll = () => setMenuOpen(false);

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [menuOpen, positionMenu]);

  const toggleMenu = useCallback((e) => {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleComplete = () => {
    completeTask(task.id);
    addToast(task.completed ? 'Task restored' : 'Task completed!', task.completed ? 'info' : 'success');
  };

  const handleDelete = () => {
    deleteTask(task.id);
    addToast('Task deleted', 'warning');
  };

  const handlePin = () => {
    pinTask(task.id);
    addToast(task.pinned ? 'Task unpinned' : 'Task pinned', 'info');
  };

  const handleArchive = () => {
    archiveTask(task.id);
    addToast(task.archived ? 'Task restored from archive' : 'Task archived', 'info');
  };

  const handleDuplicate = () => {
    duplicateTask(task.id);
    addToast('Task duplicated', 'success');
  };

  const menu = menuOpen && createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -4 }}
        transition={{ duration: 0.12 }}
        id="task-context-menu"
        className="fixed w-48 glass-card p-1.5 z-[100] shadow-xl"
        style={{ top: menuPos.top, left: menuPos.left }}
      >
        <MenuButton icon={Pencil} label="Edit" onClick={() => { closeMenu(); onEdit(task); }} />
        <MenuButton icon={task.completed ? RotateCcw : Check} label={task.completed ? 'Undo Complete' : 'Complete'} onClick={() => { closeMenu(); handleComplete(); }} />
        <MenuButton icon={Pin} label={task.pinned ? 'Unpin' : 'Pin'} onClick={() => { closeMenu(); handlePin(); }} />
        <MenuButton icon={Copy} label="Duplicate" onClick={() => { closeMenu(); handleDuplicate(); }} />
        <MenuButton icon={Archive} label={task.archived ? 'Restore' : 'Archive'} onClick={() => { closeMenu(); handleArchive(); }} />
        <div className="h-px bg-border my-1" />
        <MenuButton icon={Trash2} label="Delete" onClick={() => { closeMenu(); handleDelete(); }} danger />
      </motion.div>
    </AnimatePresence>,
    document.body
  );

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className={`glass-card p-4 group relative ${isDragging ? 'opacity-50 shadow-2xl z-50' : ''} ${task.completed ? 'task-completed' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-1 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <div className="w-1.5 h-8 rounded-full opacity-50 hover:opacity-100 transition" style={{ background: task.colorLabel }} />
        </div>

        <button
          onClick={handleComplete}
          className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
            task.completed
              ? 'bg-success border-success text-white'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {task.completed && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-semibold text-text-primary text-sm ${task.completed ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </h3>
            {task.pinned && <Pin className="w-3.5 h-3.5 text-primary fill-primary" />}
            {task.reminder && <Clock className="w-3.5 h-3.5 text-warning" />}
          </div>

          {task.description && (
            <p className="text-xs text-text-secondary mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
              <Flag className="w-2.5 h-2.5 inline mr-0.5" />
              {task.priority}
            </span>

            {task.category && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {task.category}
              </span>
            )}

            {task.dueDate && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-dim text-text-secondary">
                <Calendar className="w-2.5 h-2.5 inline mr-0.5" />
                {formatDate(task.dueDate)}
                {task.dueTime && ` ${formatTime(task.dueTime)}`}
              </span>
            )}

            {task.tags?.map(tag => (
              <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                <Tag className="w-2.5 h-2.5 inline mr-0.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative shrink-0">
          <motion.button
            ref={btnRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary/10 transition-all"
          >
            <MoreHorizontal className="w-4 h-4 text-text-secondary" />
          </motion.button>
        </div>
      </div>

      {menu}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: task.colorLabel }} />
    </motion.div>
  );
}

function MenuButton({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
        danger
          ? 'text-danger hover:bg-danger/10'
          : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

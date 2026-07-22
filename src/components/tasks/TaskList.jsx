import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTasks } from '../../context/TaskContext';
import { isOverdue, isDueToday } from '../../utils/helpers';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../../utils/constants';
import TaskCard from './TaskCard';
import EmptyState from '../ui/EmptyState';
import { ListFilter, ArrowUpDown, CheckCheck, Trash2 } from 'lucide-react';

export default function TaskList({ filter: initialFilter = 'all', showFilters = true, onEditTask, emptyTitle, emptySubtitle }) {
  const { tasks, reorderTasks, completeTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    switch (filter) {
      case 'active': result = result.filter(t => !t.completed && !t.archived); break;
      case 'completed': result = result.filter(t => t.completed && !t.archived); break;
      case 'today': result = result.filter(t => isDueToday(t.dueDate) && !t.archived); break;
      case 'upcoming': result = result.filter(t => t.dueDate && !isDueToday(t.dueDate) && !isOverdue(t.dueDate, t.dueTime) && !t.completed && !t.archived); break;
      case 'overdue': result = result.filter(t => isOverdue(t.dueDate, t.dueTime) && !t.completed && !t.archived); break;
      case 'high': result = result.filter(t => t.priority === 'High' && !t.archived); break;
      case 'medium': result = result.filter(t => t.priority === 'Medium' && !t.archived); break;
      case 'low': result = result.filter(t => t.priority === 'Low' && !t.archived); break;
      case 'pinned': result = result.filter(t => t.pinned && !t.archived); break;
      case 'archived': result = result.filter(t => t.archived); break;
      default: result = result.filter(t => !t.archived); break;
    }

    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      let cmp = 0;
      switch (sort) {
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'dueDate': cmp = (a.dueDate || 'z').localeCompare(b.dueDate || 'z'); break;
        case 'priority':
          const p = { High: 0, Medium: 1, Low: 2 };
          cmp = p[a.priority] - p[b.priority]; break;
        case 'category': cmp = (a.category || '').localeCompare(b.category || ''); break;
        case 'completed': cmp = (a.completed ? 1 : 0) - (b.completed ? 1 : 0); break;
        default: cmp = new Date(b.createdAt) - new Date(a.createdAt); break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [tasks, filter, sort, sortDir]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTasks(active.id, over.id);
      }
    }
  };

  const toggleSelect = (id) => {
    setSelectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkComplete = () => {
    selectedTasks.forEach(id => completeTask(id));
    setSelectedTasks(new Set());
    setBulkMode(false);
  };

  const bulkDelete = () => {
    selectedTasks.forEach(id => deleteTask(id));
    setSelectedTasks(new Set());
    setBulkMode(false);
  };

  return (
    <div>
      {showFilters && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1 min-w-0">
            {FILTER_OPTIONS.map(f => (
              <motion.button
                key={f.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  filter === f.value
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-surface-dim text-text-secondary hover:bg-primary/10'
                }`}
              >
                {f.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input-field py-1.5 px-3 text-xs w-auto"
            >
              {SORT_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>Sort: {s.label}</option>
              ))}
            </select>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-lg bg-surface-dim hover:bg-primary/10 transition"
            >
              <ArrowUpDown className="w-4 h-4 text-text-secondary" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { setBulkMode(!bulkMode); setSelectedTasks(new Set()); }}
              className={`p-2 rounded-lg transition ${bulkMode ? 'bg-primary/10 text-primary' : 'bg-surface-dim hover:bg-primary/10 text-text-secondary'}`}
            >
              <ListFilter className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}

      {bulkMode && selectedTasks.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20"
        >
          <span className="text-sm font-medium text-primary">{selectedTasks.size} selected</span>
          <button onClick={bulkComplete} className="btn-ghost text-xs py-1.5 text-success hover:bg-success/10">
            <CheckCheck className="w-3.5 h-3.5" /> Complete
          </button>
          <button onClick={bulkDelete} className="btn-ghost text-xs py-1.5 text-danger hover:bg-danger/10">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </motion.div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTasks.map((task, i) => (
                <div key={task.id} className="flex items-center gap-2">
                  {bulkMode && (
                    <button
                      onClick={() => toggleSelect(task.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                        selectedTasks.has(task.id)
                          ? 'bg-primary border-primary text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedTasks.has(task.id) && <CheckCheck className="w-3 h-3" />}
                    </button>
                  )}
                  <div className="flex-1">
                    <TaskCard task={task} onEdit={onEditTask} index={i} />
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {filteredTasks.length === 0 && (
        <EmptyState
          title={emptyTitle || 'No tasks found'}
          subtitle={emptySubtitle || 'Try adjusting your filters or create a new task'}
        />
      )}
    </div>
  );
}

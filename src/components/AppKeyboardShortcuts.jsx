import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useCallback } from 'react';

export default function AppKeyboardShortcuts({ onNewTask, onCloseForm }) {
  const { undoDelete } = useTasks();
  const { addToast } = useToast();

  const handleUndo = useCallback(() => {
    const restored = undoDelete();
    if (restored) addToast('Task restored', 'success');
  }, [undoDelete, addToast]);

  useKeyboardShortcuts({
    onNewTask,
    onUndo: handleUndo,
    onSearch: () => {},
    onEscape: onCloseForm,
  });

  return null;
}

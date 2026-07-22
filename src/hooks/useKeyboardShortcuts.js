import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = (handlers = {}) => {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e) => {
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);

    if (e.key === 'Escape') {
      handlers.onEscape?.();
    }

    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          handlers.onSearch?.();
          break;
        case 'n':
          e.preventDefault();
          handlers.onNewTask?.();
          break;
        case '1':
          e.preventDefault();
          navigate('/');
          break;
        case '2':
          e.preventDefault();
          navigate('/today');
          break;
        case '3':
          e.preventDefault();
          navigate('/upcoming');
          break;
        case '4':
          e.preventDefault();
          navigate('/completed');
          break;
        case '5':
          e.preventDefault();
          navigate('/archive');
          break;
        case '6':
          e.preventDefault();
          navigate('/statistics');
          break;
        default:
          break;
      }
    }

    if (e.key === '/' && !isInput) {
      e.preventDefault();
      handlers.onSearch?.();
    }

    if (e.key === 'n' && !isInput && !e.metaKey && !e.ctrlKey) {
      handlers.onNewTask?.();
    }

    if (e.key === 'z' && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
      e.preventDefault();
      handlers.onUndo?.();
    }
  }, [handlers, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

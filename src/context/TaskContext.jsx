import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createTask } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { syncTasks, fetchTasks, syncUserProfileSettings, getUserProfile, saveTask, deleteTaskFromFirestore } from '../lib/firestore';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(['Work', 'Study', 'Personal', 'Shopping', 'Fitness', 'Finance', 'Travel']);
  const [allTags, setAllTags] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState({ count: 0, lastDate: null });
  const [settings, setSettings] = useState({
    fontSize: 'medium', animations: true, notifications: true, dailyGoal: 5, weeklyGoal: 25,
  });
  const [undoStack, setUndoStack] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const uidRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setCategories(['Work', 'Study', 'Personal', 'Shopping', 'Fitness', 'Finance', 'Travel']);
      setAllTags([]);
      setAchievements([]);
      setStreak({ count: 0, lastDate: null });
      setSettings({ fontSize: 'medium', animations: true, notifications: true, dailyGoal: 5, weeklyGoal: 25 });
      setUndoStack([]);
      setLoaded(true);
      uidRef.current = null;
      return;
    }

    const loadFirestoreData = async () => {
      uidRef.current = user.uid;
      try {
        const [fireTasks, profile] = await Promise.all([
          fetchTasks(user.uid),
          userProfile ? Promise.resolve(userProfile) : getUserProfile(user.uid),
        ]);

        if (uidRef.current !== user.uid) return;

        setTasks(fireTasks.length > 0 ? fireTasks : []);

        if (profile) {
          if (profile.categories) setCategories(profile.categories);
          if (profile.achievements) setAchievements(profile.achievements);
          if (profile.streak) setStreak(profile.streak);
          setSettings(prev => ({
            ...prev,
            fontSize: profile.fontSize || prev.fontSize,
            animations: profile.animations ?? prev.animations,
            notifications: profile.notifications ?? prev.notifications,
            dailyGoal: profile.dailyGoal || prev.dailyGoal,
            weeklyGoal: profile.weeklyGoal || prev.weeklyGoal,
          }));
        }

        const tags = new Set();
        fireTasks.forEach(t => (t.tags || []).forEach(tag => tags.add(tag)));
        setAllTags([...tags]);
      } catch (err) {
        console.error('Firestore load failed:', err);
      } finally {
        setLoaded(true);
      }
    };

    loadFirestoreData();
  }, [user, userProfile]);

  useEffect(() => {
    if (!loaded || !user) return;
    localStorage.setItem('flowdo-tasks', JSON.stringify(tasks));
  }, [tasks, loaded, user]);

  useEffect(() => {
    if (!loaded || !user) return;
    localStorage.setItem('flowdo-categories', JSON.stringify(categories));
  }, [categories, loaded, user]);

  useEffect(() => {
    if (!loaded || !user) return;
    localStorage.setItem('flowdo-tags', JSON.stringify(allTags));
  }, [allTags, loaded, user]);

  useEffect(() => {
    if (!loaded || !user) return;
    localStorage.setItem('flowdo-achievements', JSON.stringify(achievements));
  }, [achievements, loaded, user]);

  useEffect(() => {
    if (!loaded || !user) return;
    localStorage.setItem('flowdo-streak', JSON.stringify(streak));
  }, [streak, loaded, user]);

  useEffect(() => {
    if (!loaded || !user) return;
    localStorage.setItem('flowdo-settings', JSON.stringify(settings));
  }, [settings, loaded, user]);

  useEffect(() => {
    if (!loaded || !user) return;
    syncUserProfileSettings(user.uid, {
      accentColor: localStorage.getItem('flowdo-accent') || '#6366F1',
      dailyGoal: settings.dailyGoal,
      weeklyGoal: settings.weeklyGoal,
      fontSize: settings.fontSize,
      animations: settings.animations,
      notifications: settings.notifications,
      categories,
      achievements,
      streak,
    }).catch(err => console.error('Profile settings sync failed:', err));
  }, [settings, categories, achievements, streak, loaded, user]);

  const checkAchievement = useCallback((id) => {
    setAchievements(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const saveToFirestore = useCallback(async (task) => {
    if (!user) return;
    try {
      await saveTask(user.uid, task);
    } catch (err) {
      console.error('Failed to save task:', err);
      addToast('Failed to sync task to cloud', 'error');
    }
  }, [user, addToast]);

  const deleteFromFirestore = useCallback(async (taskId) => {
    if (!user) return;
    try {
      await deleteTaskFromFirestore(user.uid, taskId);
    } catch (err) {
      console.error('Failed to delete task from cloud:', err);
    }
  }, [user]);

  const addTask = useCallback((data) => {
    const task = createTask(data);
    setTasks(prev => [task, ...prev]);
    setAllTags(prev => [...new Set([...prev, ...(data.tags || [])])]);
    if (tasks.length === 0) checkAchievement('first_task');
    if (tasks.length >= 9) checkAchievement('ten_tasks');
    saveToFirestore(task);
    return task;
  }, [tasks.length, checkAchievement, saveToFirestore]);

  const updateTask = useCallback((id, data) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t);
      const task = updated.find(t => t.id === id);
      if (task) saveToFirestore(task);
      return updated;
    });
    if (data.tags) {
      setAllTags(prev => [...new Set([...prev, ...data.tags])]);
    }
  }, [saveToFirestore]);

  const deleteTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setUndoStack(prev => [...prev, { type: 'delete', task, timestamp: Date.now() }]);
    }
    setTasks(prev => prev.filter(t => t.id !== id));
    deleteFromFirestore(id);
  }, [tasks, deleteFromFirestore]);

  const undoDelete = useCallback(() => {
    if (undoStack.length === 0) return null;
    const last = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    if (last.type === 'delete') {
      setTasks(prev => [...prev, last.task]);
      saveToFirestore(last.task);
      return last.task;
    }
    return null;
  }, [undoStack, saveToFirestore]);

  const completeTask = useCallback((id) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          const completed = !t.completed;
          if (completed) {
            checkAchievement('first_complete');
            const completedCount = prev.filter(tk => tk.completed).length + 1;
            if (completedCount >= 10) checkAchievement('ten_complete');
            const hour = new Date().getHours();
            if (hour < 9) checkAchievement('early_bird');
            if (hour >= 22) checkAchievement('night_owl');
          }
          return { ...t, completed, completedAt: completed ? new Date().toISOString() : null };
        }
        return t;
      });
      const task = updated.find(t => t.id === id);
      if (task) saveToFirestore(task);
      return updated;
    });
  }, [checkAchievement, saveToFirestore]);

  const pinTask = useCallback((id) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t);
      const task = updated.find(t => t.id === id);
      if (task) saveToFirestore(task);
      return updated;
    });
  }, [saveToFirestore]);

  const archiveTask = useCallback((id) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, archived: !t.archived } : t);
      const task = updated.find(t => t.id === id);
      if (task) saveToFirestore(task);
      return updated;
    });
  }, [saveToFirestore]);

  const duplicateTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newTask = createTask({
        ...task,
        title: task.title + ' (Copy)',
        completed: false,
        pinned: false,
        archived: false,
      });
      setTasks(prev => [newTask, ...prev]);
      saveToFirestore(newTask);
    }
  }, [tasks, saveToFirestore]);

  const reorderTasks = useCallback((activeId, overId) => {
    setTasks(prev => {
      const oldIndex = prev.findIndex(t => t.id === activeId);
      const newIndex = prev.findIndex(t => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      if (user) syncTasks(user.uid, updated).catch(err => {
        console.error('Reorder sync failed:', err);
      });
      return updated;
    });
  }, [user]);

  const addCategory = useCallback((category) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  }, [categories]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetApp = useCallback(() => {
    setTasks([]);
    setCategories(['Work', 'Study', 'Personal', 'Shopping', 'Fitness', 'Finance', 'Travel']);
    setAllTags([]);
    setAchievements([]);
    setStreak({ count: 0, lastDate: null });
    setUndoStack([]);
  }, []);

  const importData = useCallback((data) => {
    if (data.tasks) {
      setTasks(data.tasks);
      if (user) syncTasks(user.uid, data.tasks).catch(err => {
        console.error('Import sync failed:', err);
      });
    }
    if (data.settings) setSettings(data.settings);
    if (data.categories) setCategories(data.categories);
    if (data.tags) setAllTags(data.tags);
  }, [user]);

  const todayCompletedCount = tasks.filter(t =>
    t.completed && t.completedAt &&
    new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <TaskContext.Provider value={{
      tasks, categories, allTags, achievements, streak, settings, undoStack, syncing, loaded,
      addTask, updateTask, deleteTask, undoDelete, completeTask,
      pinTask, archiveTask, duplicateTask, reorderTasks,
      addCategory, updateSettings, resetApp, importData,
      todayCompletedCount,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);

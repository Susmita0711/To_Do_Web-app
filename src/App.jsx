import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import VerifyEmailPage from './components/auth/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import TodayTasks from './pages/TodayTasks';
import UpcomingTasks from './pages/UpcomingTasks';
import CompletedTasks from './pages/CompletedTasks';
import ArchivePage from './pages/ArchivePage';
import CalendarPage from './pages/CalendarPage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import TaskForm from './components/tasks/TaskForm';
import AlarmPopup from './components/productivity/AlarmPopup';
import AppKeyboardShortcuts from './components/AppKeyboardShortcuts';
import useTaskAlarm from './hooks/useTaskAlarm';

function FontSizeEffect() {
  const { settings } = useTasks();
  useEffect(() => {
    const sizes = { small: '13px', medium: '15px', large: '17px' };
    document.documentElement.style.fontSize = sizes[settings.fontSize] || '15px';
  }, [settings.fontSize]);
  return null;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppShell() {
  const { loading } = useAuth();
  const { loaded } = useTasks();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const { alarms, dismissAlarm } = useTaskAlarm();

  if (loading || !loaded) return <LoadingScreen />;

  const handleNewTask = () => { setEditTask(null); setTaskFormOpen(true); };
  const handleEditTask = (task) => { setEditTask(task); setTaskFormOpen(true); };
  const handleCloseForm = () => { setTaskFormOpen(false); setEditTask(null); };

  return (
    <>
      <FontSizeEffect />
      <AppKeyboardShortcuts onNewTask={handleNewTask} onCloseForm={handleCloseForm} />
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route element={<ProtectedRoute><Layout onNewTask={handleNewTask} /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard onEditTask={handleEditTask} />} />
          <Route path="/today" element={<TodayTasks onEditTask={handleEditTask} />} />
          <Route path="/upcoming" element={<UpcomingTasks onEditTask={handleEditTask} />} />
          <Route path="/completed" element={<CompletedTasks onEditTask={handleEditTask} />} />
          <Route path="/archive" element={<ArchivePage onEditTask={handleEditTask} />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <TaskForm isOpen={taskFormOpen} onClose={handleCloseForm} editTask={editTask} />
      <AlarmPopup alarms={alarms} onDismiss={dismissAlarm} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <TaskProvider>
            <BrowserRouter>
              <AppShell />
            </BrowserRouter>
          </TaskProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

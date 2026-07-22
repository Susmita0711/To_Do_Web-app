import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../ui/Toast';

export default function Layout({ onNewTask }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 animated-gradient-bg opacity-[0.03]" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72 min-h-screen flex flex-col">
        <Header
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onNewTask={onNewTask}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
}

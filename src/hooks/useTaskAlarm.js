import { useEffect, useRef, useState, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';

function playAlarmSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Ring pattern: beep-beep-beep-pause, repeat 3x
    for (let i = 0; i < 3; i++) {
      const offset = i * 0.8;
      playTone(880, now + offset, 0.15);
      playTone(1100, now + offset + 0.2, 0.15);
      playTone(880, now + offset + 0.4, 0.15);
    }
  } catch (e) {
    // Audio not available
  }
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export default function useTaskAlarm() {
  const { tasks, settings } = useTasks();
  const [alarms, setAlarms] = useState([]);
  const firedRef = useRef(new Set());

  // Check for due tasks every 15 seconds
  useEffect(() => {
    if (!settings.notifications) return;

    const check = () => {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM

      tasks.forEach(task => {
        if (!task.dueDate || !task.dueTime || task.completed || task.archived) return;
        if (task.dueDate !== today) return;

        const alarmKey = `${task.id}-${task.dueDate}-${task.dueTime}`;
        if (firedRef.current.has(alarmKey)) return;

        if (task.dueTime <= currentTime) {
          firedRef.current.add(alarmKey);

          // Play sound
          playAlarmSound();

          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('FlowDo Reminder', {
              body: `Time to do: ${task.title}`,
              icon: '/favicon.svg',
            });
          }

          // In-app alarm
          setAlarms(prev => [...prev, {
            id: alarmKey,
            task,
            timestamp: Date.now(),
          }]);
        }
      });
    };

    requestNotificationPermission();
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [tasks, settings.notifications]);

  const dismissAlarm = useCallback((alarmId) => {
    setAlarms(prev => prev.filter(a => a.id !== alarmId));
  }, []);

  const dismissAll = useCallback(() => {
    setAlarms([]);
  }, []);

  return { alarms, dismissAlarm, dismissAll };
}

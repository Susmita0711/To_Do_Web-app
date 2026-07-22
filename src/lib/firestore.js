import {
  doc, setDoc, getDoc, updateDoc, collection,
  getDocs, deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const userDoc = (uid) => doc(db, 'users', uid);
const tasksCol = (uid) => collection(db, 'users', uid, 'tasks');
const taskDoc = (uid, taskId) => doc(db, 'users', uid, 'tasks', taskId);

export async function createUserProfile(uid, data) {
  const ref = userDoc(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      name: data.name || '',
      email: data.email || '',
      photoURL: data.photoURL || '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      accentColor: '#6366F1',
      dailyGoal: 5,
      weeklyGoal: 25,
      fontSize: 'medium',
      animations: true,
      notifications: true,
      streak: { count: 0, lastDate: null },
      achievements: [],
      categories: ['Work', 'Study', 'Personal', 'Shopping', 'Fitness', 'Finance', 'Travel'],
      ...data,
    });
  } else {
    await updateDoc(ref, { lastLogin: new Date().toISOString() });
  }
  const updated = await getDoc(ref);
  return updated.data();
}

export async function getUserProfile(uid) {
  const snap = await getDoc(userDoc(uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
  await setDoc(userDoc(uid), data, { merge: true });
}

export async function syncTasks(uid, tasks) {
  if (!tasks || tasks.length === 0) return;

  for (const task of tasks) {
    await setDoc(taskDoc(uid, task.id), { ...task }, { merge: true });
  }

  const existing = await getDocs(tasksCol(uid));
  const taskIds = new Set(tasks.map(t => t.id));
  for (const d of existing.docs) {
    if (!taskIds.has(d.id)) {
      await deleteDoc(taskDoc(uid, d.id));
    }
  }
}

export async function fetchTasks(uid) {
  const snap = await getDocs(tasksCol(uid));
  const tasks = [];
  snap.forEach(d => {
    const data = d.data();
    if (data && data.id) tasks.push(data);
  });
  return tasks;
}

export async function saveTask(uid, task) {
  await setDoc(taskDoc(uid, task.id), { ...task }, { merge: true });
}

export async function deleteTaskFromFirestore(uid, taskId) {
  await deleteDoc(taskDoc(uid, taskId));
}

export async function syncUserProfileSettings(uid, settings) {
  await setDoc(userDoc(uid), settings, { merge: true });
}

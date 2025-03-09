import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskContextType, Priority } from '@/utils/types';
import SecureLS from 'secure-ls';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'tasks';

const ls = new SecureLS({ isCompression: true });

const fetchTasks = (): Task[] => {
  try {
    const tasks = ls.get(STORAGE_KEY);
    if (tasks) {
      const allTasks = JSON.parse(tasks) as Task[];
      return allTasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        order: task.order !== undefined ? task.order : 0
      }));
    }
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    ls.remove(STORAGE_KEY);
  }
  return [];
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(fetchTasks);
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      ls.set(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      order: tasks.length > 0 
        ? Math.max(...tasks.map(t => t.order)) + 1 
        : 0
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const editTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      
      const [movedTask] = newTasks.splice(startIndex, 1);
      
      newTasks.splice(endIndex, 0, movedTask);
      
      return newTasks.map((task, index) => ({
        ...task,
        order: newTasks.length - index
      }));
    });
  };

  const value = {
    tasks,
    addTask,
    editTask,
    deleteTask,
    reorderTasks,
    selectedPriority,
    setSelectedPriority,
    searchQuery,
    setSearchQuery
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}; 
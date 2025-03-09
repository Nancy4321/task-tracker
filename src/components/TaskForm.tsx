import React, { useState, useEffect } from 'react';
import { Task, Priority } from '@/utils/types';
import { useTaskContext } from '@/contexts/TaskContext';
import Button from '@/components/Button';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { addTask, editTask } = useTaskContext();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || Priority.Medium);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    if (task) {
      editTask({
        ...task,
        title: title.trim(),
        description: description.trim(),
        priority
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority
      });
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
        >
          <option value={Priority.Low}>Low</option>
          <option value={Priority.Medium}>Medium</option>
          <option value={Priority.High}>High</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {task ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
}; 
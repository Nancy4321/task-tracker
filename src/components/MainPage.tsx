import { useState, useEffect } from "react";
import { PlusIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { Modal } from "@/components/Modal";
import { Theme } from "@/utils/types";
import Button from "@/components/Button";

export default function MainPage() {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.light);

  const toggleTheme = () => {
    const newTheme = theme === Theme.light ? Theme.dark : Theme.light;
    setTheme(newTheme as Theme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as Theme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? Theme.dark : Theme.light);
      localStorage.setItem("theme", prefersDark ? Theme.dark : Theme.light);
    }
  }, []);

  useEffect(() => {
    if (theme === Theme.dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-800/90 transition-colors duration-200">
      <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Task Tracker
            </h1>
            <div className="flex items-center space-x-3">
              <Button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-500 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-colors"
                title={
                  theme === Theme.light
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
                type="button"
                aria-label="Toggle theme"
              >
                {theme === Theme.light ? (
                  <MoonIcon className="h-4 w-4" />
                ) : (
                  <SunIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => setIsAddingTask(true)}
                className="flex items-center px-3 py-1.5 bg-blue-600/90 hover:bg-blue-700/90 dark:bg-blue-500/90 dark:hover:bg-blue-600/90 text-white text-sm rounded-md transition-colors backdrop-blur-sm"
                title="Create a new task"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                <span>New Task</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TaskList />
      </main>

      <Modal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        title="Create New Task"
      >
        <TaskForm onClose={() => setIsAddingTask(false)} />
      </Modal>
    </div>
  );
} 
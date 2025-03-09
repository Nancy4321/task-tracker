import { useState, useEffect } from "react";

import { PlusIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Theme } from "@/utils/types";

export default function MainPage() {

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
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === Theme.dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Tracker</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={
                  theme === Theme.light
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
                type="button"
              >
                {theme === Theme.light ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </button>
              <button

                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                title="Create a new task"
              >
                <PlusIcon className="h-5 w-5 mr-1" /> 
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      </main>
    </div>
  );
} 
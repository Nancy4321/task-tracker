import React, { useEffect, useMemo, useRef } from "react";
import { TaskItem } from "@/components/TaskItem";
import { useTaskContext } from "@/contexts/TaskContext";
import { Priority, Task } from "@/utils/types";
import { initDragAndDrop, destroyDragAndDrop } from "@/utils/dragAndDrop";

export const TaskList: React.FC = () => {
  const {
    tasks,
    selectedPriority,
    setSelectedPriority,
    searchQuery,
    setSearchQuery,
    reorderTasks,
  } = useTaskContext();
  
  const taskListRef = useRef<HTMLDivElement>(null);

 const filteredTasks = useMemo(() => {
    return tasks
      .filter(
        (task: Task) =>
          (selectedPriority === "All" || task.priority === selectedPriority) &&
          (!searchQuery ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
      ))
      .sort(
        (a: Task, b: Task) =>
          b.order - a.order || b.createdAt.getTime() - a.createdAt.getTime()
      );
  }, [tasks, selectedPriority, searchQuery]); 

  useEffect(() => {
    if (taskListRef.current) {
      initDragAndDrop(
        ".task-list",
        ".task-wrapper",
        (startIndex: number, endIndex: number) => {
          const draggedTaskId = filteredTasks[startIndex]?.id;
          const dropTaskId = filteredTasks[endIndex]?.id;

          if (draggedTaskId && dropTaskId) {
            const originalStartIndex = tasks.findIndex(
              (task: Task) => task.id === draggedTaskId
            );
            const originalEndIndex = tasks.findIndex(
              (task: Task) => task.id === dropTaskId
            );

            if (originalStartIndex !== -1 && originalEndIndex !== -1) {
              reorderTasks(originalStartIndex, originalEndIndex);
            }
          }
        }
      );
    }

    return () => {
      destroyDragAndDrop(".task-list");
    };
  }, [filteredTasks, tasks, reorderTasks]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <input
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 dark:bg-slate-700 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <select
            value={selectedPriority}
            onChange={(e) =>
              setSelectedPriority(e.target.value as Priority | "All")
            }
            className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="All">All Priorities</option>
            <option value={Priority.High}>High Priority</option>
            <option value={Priority.Medium}>Medium Priority</option>
            <option value={Priority.Low}>Low Priority</option>
          </select>
        </div>
      </div>

      <div className="task-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={taskListRef}>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 md:col-span-2 lg:col-span-3">
            <p className="text-gray-500 dark:text-slate-300">
              No tasks found. Create a new task to get started!
            </p>
          </div>
        ) : (
          filteredTasks.map((task: Task, index: number) => (
            <div
              key={task.id}
              draggable={true}
              className="task-wrapper"
              data-order={task.order}
              data-id={task.id}
            >
              <TaskItem task={task} index={index} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 
import React, { useRef } from "react";
import { TaskItem } from "@/components/TaskItem";
import { useTaskContext } from "@/contexts/TaskContext";
import { Priority } from "@/utils/types";

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

  const filteredTasks = tasks
    .filter((task) => {
      if (selectedPriority === "All") return true;
      return task.priority === selectedPriority;
    })
    .filter((task) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (a.order !== b.order) {
        return b.order - a.order;
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <input
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value={Priority.High}>High Priority</option>
            <option value={Priority.Medium}>Medium Priority</option>
            <option value={Priority.Low}>Low Priority</option>
          </select>
        </div>
      </div>

      <div className="task-list" ref={taskListRef}>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">
              No tasks found. Create a new task to get started!
            </p>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
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
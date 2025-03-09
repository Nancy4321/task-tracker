import React, { useState } from "react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Priority, Task } from "@/utils/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { TaskForm } from "@/components/TaskForm";
import { Modal } from "@/components/Modal";
import Button from "@/components/Button";
import DeletePopup from "@/components/DeletePopup";
import TaskView from "@/components/TaskView";

interface TaskItemProps {
  task: Task;
  index: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, index }) => {
  const { deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.High:
        return "bg-red-100/70 text-red-800 dark:bg-red-800/30 dark:text-red-300";
      case Priority.Medium:
        return "bg-amber-100/70 text-amber-800 dark:bg-amber-700/30 dark:text-amber-300";
      case Priority.Low:
        return "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-300";
      default:
        return "bg-slate-100/70 text-slate-800 dark:bg-slate-700/30 dark:text-slate-300";
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteTask(task.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div key={index} className="h-[200px]">
      <div className="flex flex-col bg-white/80 dark:bg-slate-800/70 backdrop-blur-lg rounded-lg shadow-sm border border-slate-200/40 dark:border-slate-700/40 p-4 hover:shadow-md transition-all duration-200 h-full justify-between">
        <div className="flex items-start gap-3">
          <div
            className="text-slate-400 dark:text-slate-500 cursor-move select-none"
            title="Drag to reorder"
          >
            ≡
          </div>

          <div className="flex-grow space-y-3 mt-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-5 leading-tight">
                {task.title}
              </h3>
              <div
                className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(
                  task.priority
                )} backdrop-blur-sm`}
              >
                {task.priority}
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center w-full justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-3">
              Created: {task.createdAt.toLocaleString()}
            </p>
            <div className="flex justify-end space-x-1 mt-4">
              <Button
                className="p-1.5 rounded-full hover:bg-slate-100/70 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors backdrop-blur-sm"
                onClick={() => setIsViewing(true)}
                title="View details"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button
                className="p-1.5 rounded-full hover:bg-slate-100/70 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors backdrop-blur-sm"
                onClick={() => setIsEditing(true)}
                title="Edit task"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                className="p-1.5 rounded-full hover:bg-red-50/70 dark:hover:bg-red-900/40 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-300 transition-colors backdrop-blur-sm"
                onClick={handleDelete}
                title="Delete task"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TaskView
        task={task}
        isViewing={isViewing}
        setIsViewing={setIsViewing}
        getPriorityColor={getPriorityColor}
      />

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Task"
      >
        <TaskForm task={task} onClose={() => setIsEditing(false)} />
      </Modal>

      <DeletePopup
        task={task}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        confirmDelete={confirmDelete}
      />
    </div>
  );
}; 
import React, { useState } from "react";
import { Priority, Task } from "@/utils/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { TaskForm } from "@/components/TaskForm";
import { Modal } from "@/components/Modal";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

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
        return "bg-red-100 text-red-800";
      case Priority.Medium:
        return "bg-yellow-100 text-yellow-800";
      case Priority.Low:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div key={index}>
      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow">
        <div className="mr-3 text-gray-400 cursor-move" title="Drag to reorder">
          ≡
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setIsViewing(true)}
            title="View details"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setIsEditing(true)}
            title="Edit task"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            className="p-1 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
            onClick={handleDelete}
            title="Delete task"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isViewing}
        onClose={() => setIsViewing(false)}
        title="Task Details"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500">Title</label>
            <p className="text-gray-900">{task.title}</p>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900 whitespace-pre-wrap">{task.description}</p>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500">Priority</label>
            <div
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500">Created</label>
            <p className="text-gray-900">{task.createdAt.toLocaleString()}</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Task"
      >
        <TaskForm task={task} onClose={() => setIsEditing(false)} />
      </Modal>

      <Modal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete "<strong>{task.title}</strong>"?</p>
          <p className="text-sm text-red-600">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 
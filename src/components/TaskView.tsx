import { Modal } from "@/components/Modal";
import { Priority, Task } from "@/utils/types";

interface TaskViewProps {
  task: Task;
  isViewing: boolean;
  setIsViewing: (isViewing: boolean) => void;
  getPriorityColor: (priority: Priority) => string;
}

export default function TaskView({
  task,
  isViewing,
  setIsViewing,
  getPriorityColor,
}: TaskViewProps) {
  return (
    <Modal
      isOpen={isViewing}
      onClose={() => setIsViewing(false)}
      title="Task Details"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            Title
          </label>
          <p className="text-sm text-slate-900 dark:text-white">{task.title}</p>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            Description
          </label>
          <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">
            {task.description}
          </p>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            Priority
          </label>
          <div
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            Created
          </label>
          <p className="text-sm text-slate-900 dark:text-white">
            {task.createdAt.toLocaleString()}
          </p>
        </div>
      </div>
    </Modal>
  );
}

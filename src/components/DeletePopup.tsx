import Button from "@/components/Button";
import {Modal} from "@/components/Modal";
import { Task } from "@/utils/types";

interface DeletePopupProps {
    task: Task;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (isOpen: boolean) => void;
    confirmDelete: () => void;
}
export default function DeletePopup({
  task,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  confirmDelete,
}: DeletePopupProps) {
  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      title="Confirm Delete"
    >
      <div className="space-y-3">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Are you sure you want to delete "<strong>{task.title}</strong>"?
        </p>
        <p className="text-xs text-red-600 dark:text-red-400">
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="Button"
            className="px-3 py-1.5 border border-slate-300/70 dark:border-slate-600/70 rounded-md shadow-sm text-xs font-medium text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-600/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600/90 hover:bg-red-700/90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 backdrop-blur-sm"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

export enum Theme {light = 'light', dark = 'dark'};

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  createdAt: Date;
  order: number;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  editTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  selectedPriority: Priority | 'All';
  setSelectedPriority: (priority: Priority | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
} 
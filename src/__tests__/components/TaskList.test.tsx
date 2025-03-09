/* global jest, describe, beforeEach, it, expect */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskList } from "@/components/TaskList";
import { Priority, Task } from "@/utils/types";

// Mock TaskItem component to simplify testing
jest.mock("@/components/TaskItem", () => ({
  TaskItem: ({ task, index }: { task: Task; index: number }) => (
    <div data-testid={`task-item-${index}`} className="mocked-task-item">
      <div>{task.title}</div>
      <div>{task.description}</div>
      <div>{task.priority}</div>
    </div>
  ),
}));

// Mock drag and drop utils
jest.mock("@/utils/dragAndDrop", () => ({
  initDragAndDrop: jest.fn(),
  destroyDragAndDrop: jest.fn(),
}));

// Mock the TaskContext
const mockSetSelectedPriority = jest.fn();
const mockSetSearchQuery = jest.fn();
const mockReorderTasks = jest.fn();

const mockTasks = [
  {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    priority: Priority.High,
    createdAt: new Date(2023, 1, 1),
    order: 3,
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description 2",
    priority: Priority.Medium,
    createdAt: new Date(2023, 1, 2),
    order: 2,
  },
  {
    id: "3",
    title: "Task 3",
    description: "Description 3",
    priority: Priority.Low,
    createdAt: new Date(2023, 1, 3),
    order: 1,
  },
];

jest.mock("@/contexts/TaskContext", () => ({
  useTaskContext: () => ({
    tasks: mockTasks,
    selectedPriority: "All",
    setSelectedPriority: mockSetSelectedPriority,
    searchQuery: "",
    setSearchQuery: mockSetSearchQuery,
    reorderTasks: mockReorderTasks,
  }),
}));

describe("TaskList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderTaskList = (overrides = {}) => {
    const contextOverrides = {
      tasks: mockTasks,
      selectedPriority: "All",
      searchQuery: "",
      ...overrides,
    };

    jest
      .spyOn(require("@/contexts/TaskContext"), "useTaskContext")
      .mockReturnValue({
        tasks: contextOverrides.tasks,
        selectedPriority: contextOverrides.selectedPriority,
        setSelectedPriority: mockSetSelectedPriority,
        searchQuery: contextOverrides.searchQuery,
        setSearchQuery: mockSetSearchQuery,
        reorderTasks: mockReorderTasks,
      });

    return render(<TaskList />);
  };

  it("renders all tasks when no filters are applied", () => {
    renderTaskList();

    expect(screen.getByTestId("task-item-0")).toBeInTheDocument();
    expect(screen.getByTestId("task-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-item-2")).toBeInTheDocument();
  });

  it("filters tasks by priority when selected", () => {
    renderTaskList({ selectedPriority: Priority.High });

    // Only the High priority task should render
    expect(screen.getByTestId("task-item-0")).toBeInTheDocument();
    expect(screen.queryByTestId("task-item-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("task-item-2")).not.toBeInTheDocument();
  });

  it("filters tasks by search query", () => {
    renderTaskList({ searchQuery: "Task 1" });

    // Only the task with "Task 1" in title should render
    expect(screen.getByTestId("task-item-0")).toBeInTheDocument();
    expect(screen.queryByTestId("task-item-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("task-item-2")).not.toBeInTheDocument();
  });

  it("shows 'no tasks' message when no tasks match filters", () => {
    renderTaskList({ tasks: [] });

    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
  });

  it("updates search query when typing in search box", () => {
    renderTaskList();

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "new search" } });

    expect(mockSetSearchQuery).toHaveBeenCalledWith("new search");
  });

  it("updates priority filter when selecting from dropdown", () => {
    renderTaskList();

    const prioritySelect = screen.getByRole("combobox");
    fireEvent.change(prioritySelect, { target: { value: Priority.Medium } });

    expect(mockSetSelectedPriority).toHaveBeenCalledWith(Priority.Medium);
  });
});

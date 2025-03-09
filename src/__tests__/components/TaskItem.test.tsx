/* global jest, describe, beforeEach, it, expect */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskItem } from "@/components/TaskItem";
import { Priority, Task } from "@/utils/types";

const mockDeleteTask = jest.fn();
const mockEditTask = jest.fn();

jest.mock("@/contexts/TaskContext", () => ({
  useTaskContext: () => ({
    deleteTask: mockDeleteTask,
    editTask: mockEditTask,
  }),
  TaskProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

const mockTask: Task = {
  id: "task-123",
  title: "Test Task",
  description: "This is a test task description",
  priority: Priority.Medium,
  createdAt: new Date("2023-01-01T12:00:00"),
  order: 1,
};

const renderTaskItem = (task: Task = mockTask) => {
  return render(
    <TaskItem task={task} index={0} />
  );
};

describe("TaskItem Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task item with correct title and priority", () => {
    renderTaskItem();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("opens the view modal when view button is clicked", () => {
    renderTaskItem();
    fireEvent.click(screen.getByTitle("View details"));
    expect(screen.getByText("Task Details")).toBeInTheDocument();
  });

  it("opens the edit modal when edit button is clicked", () => {
    renderTaskItem();
    fireEvent.click(screen.getByTitle("Edit task"));
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  it("opens delete confirmation modal when delete button is clicked", () => {
    renderTaskItem();
    fireEvent.click(screen.getByTitle("Delete task"));
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
  });

  it("calls deleteTask when delete is confirmed", () => {
    renderTaskItem();
    fireEvent.click(screen.getByTitle("Delete task"));
    fireEvent.click(screen.getByText("Delete"));
    expect(mockDeleteTask).toHaveBeenCalledWith("task-123");
  });

  it("does not call deleteTask when delete is cancelled", () => {
    renderTaskItem();
    fireEvent.click(screen.getByTitle("Delete task"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockDeleteTask).not.toHaveBeenCalled();
  });
});

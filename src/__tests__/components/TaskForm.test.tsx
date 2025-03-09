/* global jest, describe, beforeEach, it, expect */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskForm } from "@/components/TaskForm";
import { Priority, Task } from "@/utils/types";

const mockAddTask = jest.fn();
const mockEditTask = jest.fn();
const mockOnClose = jest.fn();

jest.mock("@/contexts/TaskContext", () => ({
  useTaskContext: () => ({
    addTask: mockAddTask,
    editTask: mockEditTask,
  }),
}));

const mockTask: Task = {
  id: "task-123",
  title: "Test Task",
  description: "This is a test task description",
  priority: Priority.Medium,
  createdAt: new Date("2023-01-01T12:00:00"),
  order: 1,
};

describe("TaskForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with empty fields when no task is provided", () => {
    render(<TaskForm onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionTextarea = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;
    const prioritySelect = screen.getByLabelText(
      "Priority"
    ) as HTMLSelectElement;

    expect(titleInput.value).toBe("");
    expect(descriptionTextarea.value).toBe("");
    expect(prioritySelect.value).toBe(Priority.Medium);
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  it("renders form with task data when task is provided", () => {
    render(<TaskForm task={mockTask} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionTextarea = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;
    const prioritySelect = screen.getByLabelText(
      "Priority"
    ) as HTMLSelectElement;

    expect(titleInput.value).toBe("Test Task");
    expect(descriptionTextarea.value).toBe("This is a test task description");
    expect(prioritySelect.value).toBe(Priority.Medium);
    expect(screen.getByText("Update Task")).toBeInTheDocument();
  });

  it("calls addTask when form is submitted and no task is provided", () => {
    render(<TaskForm onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText("Title");
    const descriptionTextarea = screen.getByLabelText("Description");
    const prioritySelect = screen.getByLabelText("Priority");

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(descriptionTextarea, {
      target: { value: "New Description" },
    });
    fireEvent.change(prioritySelect, { target: { value: Priority.High } });

    fireEvent.submit(screen.getByRole("button", { name: "Add Task" }));

    expect(mockAddTask).toHaveBeenCalledWith({
      title: "New Task",
      description: "New Description",
      priority: Priority.High,
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls editTask when form is submitted and task is provided", () => {
    render(<TaskForm task={mockTask} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText("Title");
    const descriptionTextarea = screen.getByLabelText("Description");
    const prioritySelect = screen.getByLabelText("Priority");

    fireEvent.change(titleInput, { target: { value: "Updated Task" } });
    fireEvent.change(descriptionTextarea, {
      target: { value: "Updated Description" },
    });
    fireEvent.change(prioritySelect, { target: { value: Priority.Low } });

    fireEvent.submit(screen.getByRole("button", { name: "Update Task" }));

    expect(mockEditTask).toHaveBeenCalledWith({
      ...mockTask,
      title: "Updated Task",
      description: "Updated Description",
      priority: Priority.Low,
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not submit form if title is empty", () => {
    render(<TaskForm onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText("Title");

    fireEvent.change(titleInput, { target: { value: "" } });

    fireEvent.submit(screen.getByRole("button", { name: "Add Task" }));

    expect(mockAddTask).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<TaskForm onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockAddTask).not.toHaveBeenCalled();
    expect(mockEditTask).not.toHaveBeenCalled();
  });

  it("trims whitespace from inputs before submission", () => {
    render(<TaskForm onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText("Title");
    const descriptionTextarea = screen.getByLabelText("Description");

    fireEvent.change(titleInput, { target: { value: "  New Task  " } });
    fireEvent.change(descriptionTextarea, {
      target: { value: "  New Description  " },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Add Task" }));

    expect(mockAddTask).toHaveBeenCalledWith({
      title: "New Task",
      description: "New Description",
      priority: Priority.Medium,
    });
  });
});

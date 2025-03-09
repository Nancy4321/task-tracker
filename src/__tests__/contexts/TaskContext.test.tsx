/* global jest, describe, beforeEach, it, expect */
import "@testing-library/jest-dom";
import { render, act } from "@testing-library/react";
import { TaskProvider, useTaskContext } from "@/contexts/TaskContext";
import { Priority, Task, TaskContextType } from "@/utils/types";

jest.mock("secure-ls", () => {
  const mockData: Record<string, string> = {};
  return jest.fn().mockImplementation(() => ({
    get: jest.fn((key) => mockData[key]),
    set: jest.fn((key, value) => {
      mockData[key] = value;
    }),
    remove: jest.fn((key) => {
      delete mockData[key];
    }),
  }));
});

const TestComponent = ({ testCallback }: { testCallback: (context: TaskContextType) => void }) => {
  const context = useTaskContext();
  testCallback(context);
  return null;
};

describe("TaskContext Provider", () => {
  let contextValue: TaskContextType;
  let testCallback: jest.Mock;

  beforeEach(() => {
    testCallback = jest.fn();
    render(
      <TaskProvider>
        <TestComponent
          testCallback={(context: TaskContextType) => {
            contextValue = context;
            testCallback(context);
          }}
        />
      </TaskProvider>
    );
  });

  it("provides initial state with empty tasks", () => {
    expect(testCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        tasks: [],
        selectedPriority: "All",
        searchQuery: "",
      })
    );
  });

  it("addTask adds a new task with correct properties", () => {
    expect(contextValue.tasks).toHaveLength(0);

    act(() => {
      contextValue.addTask({
        title: "New Task",
        description: "Task Description",
        priority: Priority.Medium,
      });
    });

    expect(contextValue.tasks).toHaveLength(1);
    expect(contextValue.tasks[0]).toEqual(
      expect.objectContaining({
        title: "New Task",
        description: "Task Description",
        priority: Priority.Medium,
        id: expect.any(String),
        createdAt: expect.any(Date),
        order: 0,
      })
    );
  });

  it("editTask updates an existing task", () => {
    act(() => {
      contextValue.addTask({
        title: "Original Task",
        description: "Original Description",
        priority: Priority.Low,
      });
    });

    const taskId = contextValue.tasks[0].id;

    act(() => {
      contextValue.editTask({
        ...contextValue.tasks[0],
        title: "Updated Task",
        description: "Updated Description",
        priority: Priority.High,
      });
    });

    expect(contextValue.tasks).toHaveLength(1);
    expect(contextValue.tasks[0]).toEqual(
      expect.objectContaining({
        id: taskId,
        title: "Updated Task",
        description: "Updated Description",
        priority: Priority.High,
      })
    );
  });

  it("deleteTask removes a task by id", () => {
    act(() => {
      contextValue.addTask({
        title: "Task 1",
        description: "Description 1",
        priority: Priority.Low,
      });

      contextValue.addTask({
        title: "Task 2",
        description: "Description 2",
        priority: Priority.Medium,
      });
    });

    expect(contextValue.tasks).toHaveLength(2);

    const taskId = contextValue.tasks[0].id;

    act(() => {
      contextValue.deleteTask(taskId);
    });

    expect(contextValue.tasks).toHaveLength(1);
    expect(contextValue.tasks[0].title).toBe("Task 2");
  });

  it("reorderTasks properly reorders tasks and updates order numbers", () => {
    act(() => {
      contextValue.addTask({
        title: "Task 1",
        description: "Description 1",
        priority: Priority.Low,
      });
      contextValue.addTask({
        title: "Task 2",
        description: "Description 2",
        priority: Priority.Medium,
      });
      contextValue.addTask({
        title: "Task 3",
        description: "Description 3",
        priority: Priority.High,
      });
    });

    expect(contextValue.tasks).toHaveLength(3);
    expect(contextValue.tasks.map((t: Task) => t.title)).toEqual([
      "Task 3",
      "Task 2",
      "Task 1",
    ]);

    act(() => {
      contextValue.reorderTasks(0, 2);
    });

    expect(contextValue.tasks.map((t: Task) => t.title)).toEqual([
      "Task 2",
      "Task 1",
      "Task 3",
    ]);
    expect(contextValue.tasks[0].order).toBeGreaterThan(
      contextValue.tasks[1].order
    );
    expect(contextValue.tasks[1].order).toBeGreaterThan(
      contextValue.tasks[2].order
    );
  });

  it("setSelectedPriority updates the priority filter", () => {
    expect(contextValue.selectedPriority).toBe("All");

    act(() => {
      contextValue.setSelectedPriority(Priority.High);
    });

    expect(contextValue.selectedPriority).toBe(Priority.High);
  });

  it("setSearchQuery updates the search query", () => {
    expect(contextValue.searchQuery).toBe("");

    act(() => {
      contextValue.setSearchQuery("test search");
    });

    expect(contextValue.searchQuery).toBe("test search");
  });
});

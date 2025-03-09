/* global jest, describe, beforeEach, it, expect */
import "@testing-library/jest-dom";
import { render, act } from "@testing-library/react";
import { TaskProvider, useTaskContext } from "@/contexts/TaskContext";
import { Priority, TaskContextType } from "@/utils/types";

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

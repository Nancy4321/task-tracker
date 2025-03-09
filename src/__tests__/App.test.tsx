/* global jest, describe, test, expect */
import { render, screen } from "@testing-library/react";
import App from "@/App";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

jest.mock("@/components/MainPage", () => ({
  __esModule: true,
  default: () => <div data-testid="main-page">Main Page Component</div>,
}));

jest.mock("@/contexts/TaskContext", () => ({
  __esModule: true,
  TaskProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="task-provider">{children}</div>
  ),
}));

describe("App", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("renders the TaskProvider and MainPage", () => {
    render(<App />);
    expect(screen.getByTestId("task-provider")).toBeInTheDocument();
    expect(screen.getByTestId("main-page")).toBeInTheDocument();
  });
});

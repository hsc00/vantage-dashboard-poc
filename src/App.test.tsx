import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import * as DashboardModule from "./features/alerts/components/AlertDashboard";

describe("App Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the dashboard within the main layout", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeDefined();
    expect(screen.getByText(/VANTAGE ANALYTICS/i)).toBeDefined();
  });

  it("should display the error fallback when the dashboard crashes", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const spy = vi
      .spyOn(DashboardModule, "AlertDashboard")
      .mockImplementation(() => {
        throw new Error("Critical Test Error");
      });

    render(<App />);

    expect(screen.getByText(/Something went wrong/i)).toBeDefined();
    expect(screen.getByText(/Critical Test Error/i)).toBeDefined();

    consoleSpy.mockRestore();
    spy.mockRestore();
  });

  it("should attempt to reload the page when clicking the try again button", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const reloadSpy = vi.fn();

    vi.stubGlobal("location", { reload: reloadSpy });

    const spy = vi
      .spyOn(DashboardModule, "AlertDashboard")
      .mockImplementation(() => {
        throw new Error("Crash");
      });

    render(<App />);

    const retryButton = screen.getByRole("button", { name: /try again/i });

    fireEvent.click(retryButton);

    expect(reloadSpy).toHaveBeenCalled();

    vi.unstubAllGlobals();
    consoleSpy.mockRestore();
    spy.mockRestore();
  });
});

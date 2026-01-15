import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AlertDashboard } from "./AlertDashboard";

vi.mock("../hooks/useAlertStream", () => ({
  useAlertStreams: () => ({
    alerts: [
      {
        id: "1",
        severity: "critical",
        description: "Attack",
        timestamp: new Date().toISOString(),
        ip: "1.1.1.1",
      },
      {
        id: "2",
        severity: "low",
        description: "Ping",
        timestamp: new Date().toISOString(),
        ip: "2.2.2.2",
      },
    ],
  }),
}));

describe("AlertDashboard", () => {
  it("should render all severity filter buttons", () => {
    render(<AlertDashboard />);

    expect(screen.getByRole("button", { name: /all/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /critical/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /high/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /low/i })).toBeDefined();
  });

  it("should change active filter when a severity button is clicked", () => {
    render(<AlertDashboard />);

    const criticalButton = screen.getByRole("button", { name: /critical/i });
    const allButton = screen.getByRole("button", { name: /all/i });

    fireEvent.click(criticalButton);

    expect(criticalButton.className).toContain("bg-blue-600");
    expect(allButton.className).not.toContain("bg-blue-600");

    fireEvent.click(allButton);
    expect(allButton.className).toContain("bg-blue-600");
  });

  it("should update search value when typing in SearchBar", () => {
    render(<AlertDashboard />);

    const searchInput = screen.getByPlaceholderText(
      /search alerts.../i
    ) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "1.1.1.1" } });

    expect(searchInput.value).toBe("1.1.1.1");
  });
});

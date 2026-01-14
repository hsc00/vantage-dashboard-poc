import { render, screen } from "@testing-library/react";
import { VirtualizedAlertList } from "./VirtualizedList";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Alert } from "../types";

beforeEach(() => {
  const ResizeObserverMock = vi.fn().mockImplementation(function () {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });

  vi.stubGlobal("ResizeObserver", ResizeObserverMock);

  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    value: 800,
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    value: 1000,
  });
});

const mockAlerts: Alert[] = [
  {
    id: "1",
    timestamp: "2026-01-14T10:00:00Z",
    sensor: "Sensor A",
    severity: "critical",
    message: "Malware Detected",
    ip: "192.168.1.1",
  },
];

describe("VirtualizedAlertList", () => {
  it("renders correctly with data", () => {
    render(<VirtualizedAlertList alerts={mockAlerts} />);
    expect(screen.getByText("Malware Detected")).toBeDefined();
  });

  it("shows empty state when no alerts are provided", () => {
    render(<VirtualizedAlertList alerts={[]} />);
    expect(
      screen.getByText(/No alerts match your search criteria/i)
    ).toBeDefined();
  });
});

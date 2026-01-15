import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AlertRow } from "./AlertRow";
import type { Alert } from "../types";

const MOCK_DATA: Alert[] = [
  {
    id: "1",
    timestamp: "2026-01-14T10:00:00Z",
    sensor: "Sensor A",
    severity: "critical",
    message: "Critical Threat",
    ip: "10.0.0.1",
  },
  {
    id: "2",
    timestamp: "2026-01-14T11:00:00Z",
    sensor: "Sensor B",
    severity: "high",
    message: "High Risk",
    ip: "192.168.1.1",
  },
  {
    id: "3",
    timestamp: "2026-01-14T12:00:00Z",
    sensor: "Sensor C",
    severity: "low",
    message: "Minor Issue",
    ip: "172.16.0.1",
  },
];

describe("AlertRow Component", () => {
  it("renders null when alert is not found at index", () => {
    const { container } = render(<AlertRow index={99} data={MOCK_DATA} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders critical severity with correct styles", () => {
    render(<AlertRow index={0} data={MOCK_DATA} />);
    const badge = screen.getByText("critical");
    expect(badge.className).toContain("text-status-critical");
    expect(screen.getByText("Critical Threat")).toBeDefined();
  });

  it("renders high severity with correct styles", () => {
    render(<AlertRow index={1} data={MOCK_DATA} />);
    const badge = screen.getByText("high");
    expect(badge.className).toContain("text-status-high");
    expect(screen.getByText("High Risk")).toBeDefined();
  });

  it("renders low severity with correct styles", () => {
    render(<AlertRow index={2} data={MOCK_DATA} />);
    const badge = screen.getByText("low");
    expect(badge.className).toContain("text-status-low");
    expect(screen.getByText("172.16.0.1")).toBeDefined();
  });

  it("renders default styles for unknown severity", () => {
    const unknownData: Alert[] = [
      {
        id: "4",
        timestamp: "2026-01-14T13:00:00Z",
        sensor: "Sensor D",
        severity: "unsupported-value" as unknown as Alert["severity"],
        message: "Unknown severity test",
        ip: "0.0.0.0",
      },
    ];

    render(<AlertRow index={0} data={unknownData} />);

    const badge = screen.getByText("unsupported-value");
    expect(badge.className).toContain("text-gray-500");
  });

  it("formats the timestamp correctly", () => {
    render(<AlertRow index={0} data={MOCK_DATA} />);
    const timestamp = screen.getByText(/\d{2}:\d{2}/);

    expect(timestamp).toBeDefined();
    expect(timestamp.textContent).toContain("10:00");
    expect(timestamp.textContent).toContain("14/01");
  });

  it("has the correct display name for debugging", () => {
    expect(AlertRow.displayName).toBe("AlertRow");
  });
});

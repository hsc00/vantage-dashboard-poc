import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AlertRow } from "./AlertRow";
import type { Alert } from "../types";

const MOCK_DATA: Alert[] = [
  {
    id: "1",
    timestamp: "2026-01-14T10:00:00Z",
    sensor: "Sensor A",
    severity: "high",
    message: "Malware Detected",
    ip: "192.168.1.1",
  },
];

describe("AlertRow Component", () => {
  it("should display the alert message from the data array using the index", () => {
    render(<AlertRow index={0} data={MOCK_DATA} />);

    expect(screen.getByText("Malware Detected")).toBeDefined();
    expect(screen.getByText("192.168.1.1")).toBeDefined();
  });
});

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAlertFilters } from "./useAlertFilters";
import type { Alert } from "../types";

vi.mock("../../../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

const mockAlerts: Alert[] = [
  {
    id: "1",
    timestamp: "2026-01-18T10:00:00Z",
    sensor: "Sensor A",
    severity: "high",
    ip: "192.168.1.1",
    message: "High Alert Malware",
  },
  {
    id: "2",
    timestamp: "2026-01-14T10:00:00Z",
    sensor: "Sensor B",
    severity: "low",
    ip: "2.2.2.2",
    message: "Low Alert",
  },
];

describe("useAlertFilters hook", () => {
  it("should return initial statistics and data", () => {
    const { result } = renderHook(() => useAlertFilters(mockAlerts));

    expect(result.current.totalCount).toBe(2);
    expect(result.current.filteredCount).toBe(2);
    expect(result.current.filteredAlerts[0].id).toBe("1");
  });

  it("should update filteredCount when changing the filter", () => {
    const { result } = renderHook(() => useAlertFilters(mockAlerts));

    act(() => {
      result.current.setFilter("high");
    });

    expect(result.current.filter).toBe("high");
    expect(result.current.filteredCount).toBe(1);
    expect(result.current.filteredAlerts[0].severity).toBe("high");
  });

  it("should filter by severity", () => {
    const { result } = renderHook(() => useAlertFilters(mockAlerts));

    act(() => {
      result.current.setFilter("high");
    });

    expect(result.current.filteredCount).toBe(1);
    expect(result.current.filteredAlerts[0].severity).toBe("high");
  });

  it("should filter by search query in IP address", () => {
    const { result } = renderHook(() => useAlertFilters(mockAlerts));

    act(() => {
      result.current.setSearch("192.168");
    });

    expect(result.current.filteredCount).toBe(1);
    expect(result.current.filteredAlerts[0].ip).toBe("192.168.1.1");
  });

  it("should keep totalCount constant even when filtering", () => {
    const { result } = renderHook(() => useAlertFilters(mockAlerts));

    act(() => {
      result.current.setFilter("low");
    });

    expect(result.current.filteredCount).toBe(1);
    expect(result.current.totalCount).toBe(2);
  });

  it("should return empty array when no matches found", () => {
    const { result } = renderHook(() => useAlertFilters(mockAlerts));

    act(() => {
      result.current.setSearch("non-existent");
    });

    expect(result.current.filteredCount).toBe(0);
  });

  it("should filter by search query and severity simultaneously", () => {
    const { result } = renderHook(() => useAlertFilters(mockAlerts));

    act(() => {
      result.current.setFilter("high");
      result.current.setSearch("Malware");
    });

    expect(
      result.current.filteredAlerts.every(
        (alert) =>
          alert.severity === "high" && alert.message.includes("Malware")
      )
    ).toBe(true);
  });

  it("should handle combined filter and search where filter fails (branch coverage)", () => {
    const { result } = renderHook(() => useAlertFilters(mockAlerts));

    act(() => {
      result.current.setFilter("high");
      result.current.setSearch("System"); // low severity message
    });

    expect(result.current.filteredCount).toBe(0);
  });

  it("should handle empty search with whitespace (branch: normalizedQuery check)", () => {
    const { result } = renderHook(() => useAlertFilters(mockAlerts));

    act(() => {
      result.current.setSearch("   ");
    });

    expect(result.current.filteredCount).toBe(2);
  });
});

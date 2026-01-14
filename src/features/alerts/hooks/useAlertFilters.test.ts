import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAlertFilters } from "./useAlertFilters";

vi.mock("../../../mocks/mock-data.json", () => ({
  default: [
    {
      id: "1",
      timestamp: "2026-01-18T10:00:00Z",
      sensor: "Sensor A",
      severity: "high",
      ip: "2.2.2.2",
      message: "High Alert",
    },
    {
      id: "2",
      timestamp: "2026-01-14T10:00:00Z",
      sensor: "Sensor B",
      severity: "low",
      ip: "2.2.2.2",
      message: "Low Alert",
    },
  ],
}));

describe("useAlertFilters hook", () => {
  it("should return initial statistics and data", () => {
    const { result } = renderHook(() => useAlertFilters());

    expect(result.current.totalCount).toBe(2);
    expect(result.current.filter).toBe("all");
    expect(result.current.filteredAlerts[0].id).toBe("1");
  });

  it("should update filteredCount when changing the filter", () => {
    const { result } = renderHook(() => useAlertFilters());

    act(() => {
      result.current.setFilter("high");
    });

    expect(result.current.filter).toBe("high");
    expect(result.current.filteredCount).toBe(1);
    expect(result.current.filteredAlerts[0].severity).toBe("high");
  });

  it("should keep totalCount constant even when filtering", () => {
    const { result } = renderHook(() => useAlertFilters());

    act(() => {
      result.current.setFilter("low");
    });

    expect(result.current.filteredCount).toBe(1);
    expect(result.current.totalCount).toBe(2);
  });
  it("should filter by search query and severity simultaneously", () => {
    const { result } = renderHook(() => useAlertFilters());

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
});

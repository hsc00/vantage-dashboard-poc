import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAlertFilters } from "./useAlertFilters";

vi.mock("../../../mocks/mock-data.json", () => ({
  default: [
    {
      id: "1",
      severity: "high",
      timestamp: "2026-01-14T12:00:00Z",
      description: "High Alert",
      sourceIp: "1.1.1.1",
    },
    {
      id: "2",
      severity: "low",
      timestamp: "2026-01-14T10:00:00Z",
      description: "Low Alert",
      sourceIp: "2.2.2.2",
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

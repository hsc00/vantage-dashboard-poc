import { describe, it, expect } from "vitest";
import { sortByTimestampDesc } from "./sort";
import type { Alert } from "../features/alerts/types";

describe("sortByTimestampDesc", () => {
  it("The most recent alert should be on top", () => {
    const alertA = { timestamp: "2026-01-14T10:00:00Z" } as Alert;
    const alertB = { timestamp: "2026-01-14T11:30:00Z" } as Alert;

    const result = [alertA, alertB].sort(sortByTimestampDesc);

    expect(result[0].timestamp).toBe("2026-01-14T11:30:00Z");
  });

  it("should correctly sort alerts from different days", () => {
    const yesterday = { timestamp: "2026-01-13T23:59:00Z" } as Alert;
    const today = { timestamp: "2026-01-14T08:00:00Z" } as Alert;

    const result = [yesterday, today].sort(sortByTimestampDesc);

    expect(result[0].timestamp).toBe("2026-01-14T08:00:00Z");
  });
});

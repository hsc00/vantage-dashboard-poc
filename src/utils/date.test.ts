import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatAlertTimestamp } from "./date";

describe("formatAlertTimestamp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-14T15:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should only show the time if the alert is from today", () => {
    const todayTimestamp = "2026-01-14T10:30:00Z";
    const result = formatAlertTimestamp(todayTimestamp);

    expect(result).toBe("10:30");
  });

  it("should show the date and month if the alert is from a previous day", () => {
    const yesterdayTimestamp = "2026-01-13T22:00:00Z";
    const result = formatAlertTimestamp(yesterdayTimestamp);

    expect(result).toContain("13/01");
    expect(result).toContain("22:00");
  });
});

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAlertStreams } from "./useAlertStream";
import { ALERT_CONFIG } from "../config";

describe("useAlertStreams", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const mockCrypto = {
      getRandomValues: (arr: Uint32Array) => {
        arr[0] = 0.9 * (0xffffffff + 1); // Forces a critical severity
        return arr;
      },
      randomUUID: () => "test-uuid",
    };
    vi.stubGlobal("crypto", mockCrypto);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should generate a new alert after the interval", () => {
    const { result } = renderHook(() => useAlertStreams());

    act(() => {
      vi.advanceTimersByTime(ALERT_CONFIG.STREAM_INTERVAL_MS);
    });

    expect(result.current.alerts).toHaveLength(1);
    expect(result.current.alerts[0].severity).toBe("critical");
  });

  it("should not add alerts if the document is hidden", () => {
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);

    const { result } = renderHook(() => useAlertStreams());

    act(() => {
      vi.advanceTimersByTime(ALERT_CONFIG.STREAM_INTERVAL_MS);
    });

    expect(result.current.alerts).toHaveLength(0);
  });

  it("should respect the MAX_ALERTS_BUFFER limit", () => {
    const { result } = renderHook(() => useAlertStreams());

    act(() => {
      for (let i = 0; i < ALERT_CONFIG.MAX_ALERTS_BUFFER + 10; i++) {
        vi.advanceTimersByTime(ALERT_CONFIG.STREAM_INTERVAL_MS);
      }
    });

    expect(result.current.alerts).toHaveLength(ALERT_CONFIG.MAX_ALERTS_BUFFER);
  });

  it("should cover different severity branches (high/low)", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (arr: Uint32Array) => {
        arr[0] = 0.5 * (0xffffffff + 1); // Forces a high severity
        return arr;
      },
      randomUUID: () => "id",
    });

    const { result } = renderHook(() => useAlertStreams());

    act(() => {
      vi.advanceTimersByTime(ALERT_CONFIG.STREAM_INTERVAL_MS);
    });

    expect(result.current.alerts[0].severity).toBe("high");
  });

  it("should cover the low severity branch", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (arr: Uint32Array) => {
        arr[0] = 0.1 * (0xffffffff + 1);
        return arr;
      },
      randomUUID: () => "low-id",
    });

    const { result } = renderHook(() => useAlertStreams());

    act(() => {
      vi.advanceTimersByTime(ALERT_CONFIG.STREAM_INTERVAL_MS);
    });

    expect(result.current.alerts[0].severity).toBe("low");
  });
});

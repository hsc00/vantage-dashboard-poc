import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should update value only after the specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    rerender({ value: "updated", delay: 500 });

    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });

  it("should cancel the previous timeout if value changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "first" } }
    );

    rerender({ value: "second" });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    rerender({ value: "third" });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("third");
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { VirtualizedAlertList } from "./VirtualizedList";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Virtualizer, VirtualItem } from "@tanstack/react-virtual";
import type { Alert, Severity } from "../types";

vi.mock("./AlertRow", () => ({
  AlertRow: ({ index }: { index: number }) => (
    <div data-testid="row">Row {index}</div>
  ),
}));

const mockScrollToOffset = vi.fn();

type MockGetVirtualItems = {
  (): VirtualItem[];
  updateDeps: (newDeps: [number[], VirtualItem[]]) => void;
};

const createMockVirtualizer = (
  count: number,
  items: VirtualItem[]
): Partial<Virtualizer<Element, Element>> => {
  const getVirtualItems = (() => items) as MockGetVirtualItems;
  getVirtualItems.updateDeps = vi.fn();

  return {
    getVirtualItems,
    getTotalSize: () => count * 48,
    scrollToOffset: mockScrollToOffset,
  };
};

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: vi.fn().mockImplementation(({ count }: { count: number }) => {
    const items: VirtualItem[] = Array.from({ length: Math.min(count, 3) }).map(
      (_, i) => ({
        index: i,
        key: `row-${i}`,
        size: 48,
        start: i * 48,
        end: (i + 1) * 48,
        lane: 0,
      })
    );
    return createMockVirtualizer(count, items);
  }),
}));

describe("VirtualizedAlertList", () => {
  const mockAlerts = (num: number): Alert[] =>
    Array.from({ length: num }).map((_, i) => ({
      id: `${i}`,
      severity: "low" as Severity,
      message: "test",
      timestamp: new Date().toISOString(),
      sensor: "test-sensor",
      ip: "127.0.0.1",
    }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state message when alerts is empty", () => {
    render(<VirtualizedAlertList alerts={[]} />);
    expect(
      screen.getByText(/No alerts match your search criteria/i)
    ).toBeTruthy();
  });

  it("handles the full scroll management lifecycle", () => {
    const { container, rerender } = render(
      <VirtualizedAlertList alerts={mockAlerts(5)} />
    );
    const scrollContainer = container.querySelector(
      ".overflow-auto"
    ) as HTMLDivElement;

    let internalScroll = 0;
    Object.defineProperty(scrollContainer, "scrollTop", {
      get: () => internalScroll,
      set: (value) => {
        internalScroll = value;
      },
      configurable: true,
    });
    scrollContainer.scrollBy = vi.fn((options) => {
      if (typeof options === "object") internalScroll += options.top || 0;
    });

    // 1. User is filtering
    rerender(<VirtualizedAlertList alerts={mockAlerts(3)} />);
    expect(mockScrollToOffset).toHaveBeenCalledWith(0);
    vi.clearAllMocks();

    // 2. No changes
    rerender(<VirtualizedAlertList alerts={mockAlerts(3)} />);
    expect(mockScrollToOffset).not.toHaveBeenCalled();

    // 3. New Data, user at top
    internalScroll = 0;
    rerender(<VirtualizedAlertList alerts={mockAlerts(5)} />);
    expect(mockScrollToOffset).toHaveBeenCalledWith(0);
    vi.clearAllMocks();

    // 4. Focus preserved, user scrolled down
    internalScroll = 100;
    fireEvent.scroll(scrollContainer, { target: { scrollTop: 100 } });

    rerender(<VirtualizedAlertList alerts={mockAlerts(8)} />);

    expect(internalScroll).toBe(244);
  });

  it("skips rendering when virtual item index has no corresponding alert", () => {
    vi.mocked(useVirtualizer).mockImplementationOnce(
      ({ count }: { count: number }) => {
        return createMockVirtualizer(count, [
          { index: 99, key: "empty", size: 48, start: 0, end: 48, lane: 0 },
        ]) as Virtualizer<Element, Element>;
      }
    );

    const { container } = render(
      <VirtualizedAlertList alerts={mockAlerts(1)} />
    );
    expect(container.querySelectorAll('[data-testid="row"]').length).toBe(0);
  });

  it("covers virtualizer configuration callbacks", () => {
    const alerts = mockAlerts(1);
    render(<VirtualizedAlertList alerts={alerts} />);
    const options = vi.mocked(useVirtualizer).mock.calls[0][0];

    expect(options.getScrollElement()).not.toBeNull();
    expect(options.estimateSize?.(0)).toBe(48);
    expect(options.getItemKey?.(0)).toBe(alerts[0].id);
    expect(options.getItemKey?.(99)).toBe(99);
  });

  it("does not trigger scroll logic when alerts count is unchanged", () => {
    const alerts = mockAlerts(5);
    const { rerender } = render(<VirtualizedAlertList alerts={alerts} />);

    vi.clearAllMocks();

    // Rerender com a mesma quantidade de alertas
    rerender(<VirtualizedAlertList alerts={[...alerts]} />);

    // Verifica que nenhuma função de scroll foi chamada
    expect(mockScrollToOffset).not.toHaveBeenCalled();
  });
});

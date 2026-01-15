/**
 * "use no memo" - Opt-out directive for the React Compiler (React 19).
 * TanStack Virtual uses internal state and ref patterns that are currently
 * incompatible with the compiler auto memoization logic.
 */
"use no memo";

import { useRef, useLayoutEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AlertRow } from "./AlertRow";
import type { Alert } from "../types";
import { ALERT_CONFIG } from "../config";

interface Props {
  alerts: Alert[];
}

export const VirtualizedAlertList = ({ alerts }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const isAtTop = useRef(true);
  const lastCountRef = useRef(alerts.length);

  /**
   * We disable incompatible-library because useVirtualizer returns non-memoizable functions
   * that would trigger infinite re-render warnings in the new React linting suite.
   */
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: alerts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ALERT_CONFIG.ROW_HEIGHT_PX,
    overscan: 5,
    getItemKey: (index) => alerts.at(index)?.id ?? index, // Keys to help the virtualizer maintain position when items are prepended
  });

  // Monitor scroll to determine if we should follow the stream or stay at current position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // 10px threshold to account for sub-pixel precision and small movements
    isAtTop.current =
      e.currentTarget.scrollTop <= ALERT_CONFIG.SCROLL_THRESHOLD_PX;
  };

  /**
   * SCROLL MANAGEMENT:
   * 1. If filtering: Always scroll to top to prevent "Zombie Scroll" (rendering an empty offset).
   * 2. If new data: Only scroll to top if the user is already at the top (Sticky Scroll).
   * 3. If investigating: If user scrolled down, we don't jump, preserving their focus.
   */
  // Synchronously adjusts scroll position before the browser paints to prevent visual flickering.
  useLayoutEffect(() => {
    const currentCount = alerts.length;
    const prevCount = lastCountRef.current;
    const delta = currentCount - prevCount;

    if (delta === 0) return;

    lastCountRef.current = currentCount;

    // Case 1 and 2: Scroll to top if filtering or if new data and user is at top
    if (delta < 0 || isAtTop.current) {
      rowVirtualizer.scrollToOffset(0);
      return;
    }

    // User is scrolled down, preserve position
    parentRef.current?.scrollBy({ top: delta * ALERT_CONFIG.ROW_HEIGHT_PX });
  }, [alerts.length, rowVirtualizer]);

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
        <p className="text-sm">No alerts match your search criteria.</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className="flex-1 overflow-auto relative"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const alert = alerts[virtualRow.index];
          // If alert is undefined skip rendering this row
          if (!alert) return null;

          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <AlertRow index={virtualRow.index} data={alerts} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

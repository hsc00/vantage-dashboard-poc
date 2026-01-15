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
    estimateSize: () => 48,
    overscan: 5,
    getItemKey: (index) => alerts[index]?.id ?? index, // Keys to help the virtualizer maintain position when items are prepended
  });

  // Monitor scroll to determine if we should follow the stream or stay at current position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // 5px threshold to account for sub-pixel precision and small movements
    isAtTop.current = e.currentTarget.scrollTop <= 5;
  };

  /**
   * SCROLL MANAGEMENT:
   * 1. If filtering: Always scroll to top to prevent "Zombie Scroll" (rendering an empty offset).
   * 2. If new data: Only scroll to top if the user is already at the top (Sticky Scroll).
   * 3. If investigating: If user scrolled down, we don't jump, preserving their focus.
   */
  useLayoutEffect(() => {
    const isFiltering = alerts.length < lastCountRef.current;
    const isNewData = alerts.length > lastCountRef.current;

    if (isFiltering) {
      rowVirtualizer.scrollToOffset(0);
    } else if (isNewData) {
      if (isAtTop.current) {
        rowVirtualizer.scrollToOffset(0);
      } else {
        const delta = (alerts.length - lastCountRef.current) * 48;
        if (parentRef.current) {
          parentRef.current.scrollTop += delta;
        }
      }
    }

    lastCountRef.current = alerts.length;
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
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            className="absolute top-0 left-0 w-full"
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <AlertRow index={virtualRow.index} data={alerts} />
          </div>
        ))}
      </div>
    </div>
  );
};

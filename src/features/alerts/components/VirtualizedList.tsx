/**
 * "use no memo" - Opt-out directive for the React Compiler (React 19).
 * TanStack Virtual uses internal state and ref patterns that are currently
 * incompatible with the compiler auto memoization logic.
 */
"use no memo";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AlertRow } from "./AlertRow";
import { useEffect } from "react";
import type { Alert } from "../types";

interface Props {
  alerts: Alert[];
}

export const VirtualizedAlertList = ({ alerts }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  /**
   * We disable incompatible-library because useVirtualizer returns non-memoizable functions
   * that would trigger infinite re-render warnings in the new React linting suite.
   * This is a known compatibility gap between TanStack Virtual and React 19.
   */
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: alerts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  /**
   * Zombie Scroll Prevention
   * When the alerts list is filtered, the total scrollable height changes.
   * We force the scroll position back to the top to prevent the virtualizer
   * from being stuck in a scroll offset that no longer exists.
   */
  const lastCountRef = useRef(alerts.length);
  useEffect(() => {
    if (alerts.length < lastCountRef.current) {
      rowVirtualizer.scrollToOffset(0);
    }
    lastCountRef.current = alerts.length;
  }, [alerts.length, rowVirtualizer]);

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p className="text-sm">No alerts match your search criteria.</p>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="flex-1 overflow-auto relative">
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

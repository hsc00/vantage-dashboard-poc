"use no memo";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AlertRow } from "./AlertRow";
import type { Alert } from "../types";

interface Props {
  alerts: Alert[];
}

export const VirtualizedAlertList = ({ alerts }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: alerts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

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

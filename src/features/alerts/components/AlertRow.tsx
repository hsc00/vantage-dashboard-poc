import { memo } from "react";
import type { Alert } from "../types";
import { ALERT_TABLE_LAYOUT } from "../constants";
import { formatAlertTimestamp } from "../../../utils/date";

interface AlertRowProps {
  index: number;
  data: Alert[];
}

export const AlertRow = memo(({ index, data }: AlertRowProps) => {
  const alert = data[index];
  if (!alert) return null;

  return (
    <div className="flex items-center h-full px-6 border-b border-brand-border hover:bg-white/[0.02] transition-colors group">
      <div className={ALERT_TABLE_LAYOUT.TIMESTAMP}>
        <span className="text-[14px] sm:text-xs text-gray-400 font-mono">
          {formatAlertTimestamp(alert.timestamp)}
        </span>
      </div>

      <div className={ALERT_TABLE_LAYOUT.SEVERITY}>
        <span
          className={`px-2 py-0.5 rounded border text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
            SEVERITY_VARIANTS[alert.severity]
          }`}
        >
          {alert.severity}
        </span>
      </div>

      <div className={ALERT_TABLE_LAYOUT.MESSAGE}>
        <span className="text-xs sm:text-sm text-gray-200 truncate block font-medium">
          {alert.message}
        </span>
      </div>

      <div className={ALERT_TABLE_LAYOUT.SOURCE_IP}>
        <span className="text-[12px] text-gray-500 font-mono italic">
          {alert.ip}
        </span>
      </div>
    </div>
  );
});

AlertRow.displayName = "AlertRow";

const SEVERITY_VARIANTS = {
  critical:
    "text-status-critical border-status-critical/30 bg-status-critical/10",
  high: "text-status-high border-status-high/30 bg-status-high/10",
  low: "text-status-low border-status-low/30 bg-status-low/10",
};

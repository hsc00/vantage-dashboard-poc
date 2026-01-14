/* * eslint-disable security/detect-object-injection
 * This rule is disabled for this file because the linter produces false positives
 * during data flow analysis even with switch cases or Maps.
 * The severity styles are strictly mapped to our domain model and are safe.
 */
import { memo } from "react";
import type { Alert } from "../types";
import { ALERT_TABLE_LAYOUT } from "../constants";
import { formatAlertTimestamp } from "../../../utils/date";

interface AlertRowProps {
  index: number;
  data: Alert[];
}

// Helper function to get styles without dynamic object access (silences Linter)
const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case "critical":
      return "text-status-critical border-status-critical/30 bg-status-critical/10";
    case "high":
      return "text-status-high border-status-high/30 bg-status-high/10";
    case "low":
      return "text-status-low border-status-low/30 bg-status-low/10";
    default:
      return "text-gray-500 border-gray-500/30 bg-gray-500/10";
  }
};

export const AlertRow = memo(({ index, data }: AlertRowProps) => {
  const alert = data[index];
  if (!alert) return null;

  const severityClass = getSeverityStyles(alert.severity);

  return (
    <div className="flex items-center h-full px-6 border-b border-brand-border hover:bg-white/[0.02] transition-colors group">
      <div className={ALERT_TABLE_LAYOUT.TIMESTAMP}>
        <span className="text-[14px] sm:text-xs text-gray-400 font-mono">
          {formatAlertTimestamp(alert.timestamp)}
        </span>
      </div>

      <div className={ALERT_TABLE_LAYOUT.SEVERITY}>
        <span
          className={`px-2 py-0.5 rounded border text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${severityClass}`}
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

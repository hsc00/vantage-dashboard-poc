export type Severity = "critical" | "high" | "low";

export interface Alert {
  id: string;
  timestamp: string;
  sensor: string;
  severity: Severity;
  ip: string;
  message: string;
}

export type FilterStatus = "all" | Severity;

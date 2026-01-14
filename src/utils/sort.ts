import type { Alert } from "../features/alerts/types";

export const sortByTimestampDesc = (a: Alert, b: Alert): number => {
  return b.timestamp.localeCompare(a.timestamp);
};

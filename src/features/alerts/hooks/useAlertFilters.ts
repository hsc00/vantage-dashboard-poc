import { useMemo, useState } from "react";
import type { Alert, FilterStatus } from "../types";
import { sortByTimestampDesc } from "../../../utils/sort";

export const useAlertFilters = (rawAlerts: Alert[]) => {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  // useMemo to optimize filtering performance
  const filteredAlerts = useMemo(() => {
    return rawAlerts
      .filter((alert) => {
        const matchesFilter = filter === "all" || alert.severity === filter;
        const matchesSearch =
          alert.message
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) || alert.ip.includes(search);

        return matchesFilter && matchesSearch;
      })
      .sort(sortByTimestampDesc);
  }, [filter, search, rawAlerts]);

  return {
    filter,
    setFilter,
    search,
    setSearch,
    filteredAlerts,
    totalCount: rawAlerts.length,
    filteredCount: filteredAlerts.length,
  };
};

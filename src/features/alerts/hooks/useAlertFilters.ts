import { useMemo, useState } from "react";
import type { Alert, FilterStatus } from "../types";
import mockData from "../../../mocks/mock-data.json";
import { sortByTimestampDesc } from "../../../utils/sort";

export const useAlertFilters = () => {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  const alerts = mockData as Alert[];

  // useMemo to optimize filtering performance
  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((alert) => {
        const matchesFilter = filter === "all" || alert.severity === filter;
        const matchesSearch =
          alert.message
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) || alert.ip.includes(search);

        return matchesFilter && matchesSearch;
      })
      .sort(sortByTimestampDesc);
  }, [filter, search]);

  return {
    filter,
    setFilter,
    search,
    setSearch,
    filteredAlerts,
    totalCount: alerts.length,
    filteredCount: filteredAlerts.length,
  };
};

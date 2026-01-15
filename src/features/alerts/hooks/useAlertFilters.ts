import { useMemo, useState } from "react";
import type { Alert, FilterStatus } from "../types";
import { sortByTimestampDesc } from "../../../utils/sort";
import { useDebounce } from "../../../hooks/useDebounce";

export const useAlertFilters = (rawAlerts: Alert[]) => {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  /**
   * We use useMemo combined with debouncedSearch to ensure that heavy filtering
   * and sorting operationsonly execute 300ms after the user stops typing.
   * This prevents Main Thread blocking and UI stuttering on large datasets.
   */
  const filteredAlerts = useMemo(() => {
    const normalizedQuery = debouncedSearch.trim().toLocaleLowerCase();

    return rawAlerts
      .filter((alert) => {
        const matchesFilter = filter === "all" || alert.severity === filter;
        if (!normalizedQuery) return matchesFilter;
        const matchesSearch =
          alert.message.toLocaleLowerCase().includes(normalizedQuery) ||
          alert.ip.includes(normalizedQuery);

        return matchesFilter && matchesSearch;
      })
      .sort(sortByTimestampDesc);
  }, [filter, debouncedSearch, rawAlerts]);

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

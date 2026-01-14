import { useAlertFilters } from "../hooks/useAlertFilters";
import { SearchBar } from "./SearchBar";
import { VirtualizedAlertList } from "./VirtualizedList";
import { ALERT_TABLE_LAYOUT } from "../constants";

export const AlertDashboard = () => {
  const { filter, setFilter, search, setSearch, filteredAlerts } =
    useAlertFilters();

  return (
    <div className="flex flex-col h-screen bg-brand-dark text-white p-4 sm:p-6 font-sans">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          VANTAGE ANALYTICS
        </h1>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex gap-1 bg-brand-surface p-1 rounded border border-brand-border">
            {(["all", "critical", "high", "low"] as const).map((severity) => (
              <button
                key={severity}
                onClick={() => setFilter(severity)}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                  filter === severity
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 bg-brand-surface rounded-lg border border-brand-border overflow-hidden flex flex-col">
        <div className="flex items-center px-6 h-12 bg-white/[0.02] text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-brand-border">
          <span className={ALERT_TABLE_LAYOUT.TIMESTAMP}>Timestamp</span>
          <span className={ALERT_TABLE_LAYOUT.SEVERITY}>Severity</span>
          <span className={ALERT_TABLE_LAYOUT.MESSAGE}>Description</span>
          <span className={ALERT_TABLE_LAYOUT.SOURCE_IP}>Source IP</span>
        </div>
        <VirtualizedAlertList alerts={filteredAlerts} />
      </div>
    </div>
  );
};

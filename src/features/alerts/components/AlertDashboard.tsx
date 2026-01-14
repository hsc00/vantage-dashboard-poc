import { useAlertFilters } from "../hooks/useAlertFilters";
import { SearchBar } from "./SearchBar";
import { VirtualizedAlertList } from "./VirtualizedList";
import { ALERT_TABLE_LAYOUT } from "../constants";

export const AlertDashboard = () => {
  const { filter, setFilter, search, setSearch, filteredAlerts } =
    useAlertFilters();

  return (
    <div className="flex flex-col h-screen bg-brand-dark text-white p-4 sm:p-6 font-sans">
      <header className="mb-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap">
          VANTAGE ANALYTICS
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <div className="w-full md:w-80">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex w-full md:w-auto bg-brand-surface p-1 rounded border border-brand-border">
            {(["all", "critical", "high", "low"] as const).map((severity) => (
              <button
                key={severity}
                onClick={() => setFilter(severity)}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                  filter === severity
                    ? "bg-blue-600 text-white shadow-lg"
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

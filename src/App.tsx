import { AlertDashboard } from "./features/alerts/components/AlertDashboard";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./features/alerts/components/ErrorFallback";

function App() {
  return (
    <main className="antialiased min-h-screen">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <AlertDashboard />
      </ErrorBoundary>
    </main>
  );
}

export default App;

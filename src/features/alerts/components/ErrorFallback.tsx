import type { FallbackProps } from "react-error-boundary";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div
    className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4"
    role="alert"
  >
    <div className="max-w-md text-center">
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <pre className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

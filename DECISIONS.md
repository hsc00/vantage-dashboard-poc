# Technical Decisions & Architecture

This document outlines the architectural choices made during the development of the Vantage Alerts Dashboard.

## 1. Headless Virtualization (`@tanstack/react-virtual`)

**Problem:** Rendering thousands of security alerts simultaneously degrades browser performance and increases memory consumption.
**Solution:** Utilized `@tanstack/react-virtual` for headless virtualization.
**Why this over others:**

- **Headless UI**: It doesn't enforce specific DOM structures or styling, allowing us to keep our Tailwind-based layout intact.
- **Dynamic Measurement**: It offers superior support for dynamic row heights and smoother scrolling synchronization compared to older libraries like `react-window`.
- **Logic/UI Separation**: Perfectly aligns with our architecture of keeping logic in hooks and UI in pure components.

## 2. Optimized Filtering Engine (`useAlertFilters` + `Debounce`)

- **Decision:** Implemented a debounced filtering strategy using useMemo and a custom useDebounce hook. **Why:**
- **Main Thread Preservation:** Filtering and sorting large datasets are O(n log n) operations. Without a debounce, typing a 10 character search term would trigger 10 expensive re-computations.
- **Computational Efficiency:** By introducing a 300ms delay, we ensure the engine only runs once per user intent, significantly reducing CPU cycles and preventing input lag.
- **UX/Performance Balance:** The search state remains immediate for UI responsiveness, while the debouncedSearch controls the heavy lifting.

## 3. Real-time Stream Architecture (`useAlertStreams`)

**Decision:** Implemented an asynchronous "Producer-Consumer" pattern using a custom hook.
**Why:**

- **Future-Proofing**: The hook abstracts the data source. Swapping the current `setInterval` simulation for a **WebSocket** or **Server-Sent Events (SSE)** implementation requires zero changes to the UI components.
- **Asynchronous State Updates**: Effectively handles high-frequency updates by merging new simulated traffic with existing state, mimicking real world industrial sensor behavior.

## 4. Security-First Development

**Decision:** Applied "Secure by Design" principles even in the PoC stage.

- **Cryptographic Entropy**: Replaced `Math.random()` with `window.crypto.getRandomValues()` for unique ID generation, preventing PRNG predictability.
- **Static Analysis**: Integrated `eslint-plugin-security` and `sonarjs` to catch vulnerabilities during development.
- **Commit Integrity**: Enforced GPG signed commits to ensure authorship provenance and prevent code tampering in the repository history.

## 5. Automated Quality Gates (Husky & Vitest)

**Decision:** Implementation of a strict **Pre-commit Hook** pipeline.
**Why:**

- **Zero-Regression**: No code is committed unless it passes the full test suite and type-checking (`tsc`).
- **Code Coverage**: Integrated `vitest/coverage-v8` to maintain a high bar for logic testing, ensuring 100% coverage on critical business logic like severity styling and data filtering.

## 6. CSS Architecture (Tailwind structure)

**Decision:** Use Tailwind for rapid UI development with a custom `brand` color palette.
**Why:**

- **Consistency**: Centralized theme for "brand" colors, ensuring the dashboard matches the security-industrial aesthetic of the Vantage product.

## 7. Memory Management (Rolling Buffer Strategy)

**Decision:** Implemented a fixed size rolling buffer for the live data stream.
**Why:**

- **Memory Leak Prevention:** In professional monitoring environments, dashboards remain open for days. Without a cap, the alerts array would grow indefinitely, eventually crashing the browser tab.
  **Constant Time Performance:** By limiting the state to 5000 entries using slice, we guarantee that filtering and rendering performance remains constant relative to session duration regardless of how long the stream has been running.

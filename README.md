# Vantage Analytics Dashboard

![CI Status](https://github.com/hsc00/vantage-poc/actions/workflows/ci.yml/badge.svg)

A high-performance Cybersecurity Alert Dashboard implementation, inspired by the **Nozomi Networks Vantage** product. This project focuses on data density, rendering efficiency, and logical robustness in mission critical environments.

## Key Features

- **Data Virtualization:** Implemented `@tanstack/react-virtual` to handle thousands of security logs while maintaining a smooth 60 FPS by rendering only the visible viewport.
- **Multi-level Filtering:** Combined real-time severity filters and a global search engine (supporting both Message and Source IP).
- **Smart State Architecture:** Logic centralized in custom Hooks with `useMemo` optimizations to prevent unnecessary re calculations during state updates.
- **Enterprise UI:** A professional dark mode UI built with Tailwind CSS and Lucide Icons, optimized for high-density information display, inspired by the Nozomi Vantage images available online.
- **Search Optimization:** Implementation of a custom Debounce mechanism to ensure the main thread remains responsive even during heavy filtering operations on large datasets.

## Tech Stack

- **React 18** (Vite)
- **TypeScript** (Strictly typed interfaces for Alerts and Filters)
- **Tailwind CSS** (Utility-first styling with extracted constant patterns)
- **Vitest & React Testing Library** (Unit & Integration Testing)
- **Lucide React** (Industry-standard iconography)

## Engineering Insights

### 1. Performance at Scale & Computational Efficiency

In industrial monitoring, alert logs can grow exponentially. To handle this, I implemented a dual-layer optimization strategy:
**DOM Layer (Virtualization):** Using @tanstack/react-virtual to ensure the browser only processes visible rows, maintaining performance.
**Logic Layer (Debouncing & Memoization):** Filtering and sorting are computationally expensive (approaching O(n log n) due to sorting). I implemented a custom useDebounce hook to ensure these operations only trigger 300ms after the user stops typing. This prevents "input lag" and minimizes CPU cycles, a critical requirement for high density dashboards.

Note on Implementation: I opted for a custom useDebounce hook instead of an external library to demonstrate understanding of React's useEffect cleanup patterns and to keep the bundle size minimal.

### 2. Testing Strategy & Reliability

I followed a testing strategy focused on high-value coverage:

- **Business Logic:** Unit tests for sorting algorithms and data normalization.
- **Custom Hooks:** Isolated testing of `useAlertFilters` to ensure search logic is bulletproof, including locale sensitive comparisons to handle international character sets.
- **Component Integration:** Verifying that user interactions (filtering, searching, clearing) correctly update the virtualized list.

### 3. Maintainability & "Clean Code"

To avoid the common "utility class soup" in Tailwind projects, I extracted complex styling patterns into static constants at the bottom of component files. This separates **Layout Structure** from **Styling Configuration**, making the code more readable and easier to audit during Peer Reviews.

## 4. CI/CD & Security Measures

This project follows a "Security by Design" approach, implementing a professional pipeline and code provenance:

- **Automated Static Analysis (SAST):** Since enterprise tools like SonarQube or GitHub CodeQL require specific licensing for private repositories, I have integrated **SonarJS** and **ESLint Security** plugins directly into the local development and CI workflow. This ensures:
  - **Cognitive Complexity Monitoring:** Functions are kept simple and maintainable (capped at a complexity score of 15).
  - **Vulnerability Detection:** Real-time scanning for insecure patterns, such as object injections or ReDoS.
- **GitHub Actions CI:** A dedicated workflow automatically triggers on every push to the `main` branch, running the full test suite and type-checking to prevent regressions.
- **Git Hooks & Quality Gates:** Using **Husky** and **lint-staged**, the project enforces that only code passing all linting and security rules can be committed.
- **Commit Provenance:** To ensure code integrity and authorship, all commits are cryptographically signed using **GPG**.

---

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run in development mode:**

   ```bash
   npm run dev
   ```

3. **Run unit tests:**
   ```bash
   npm test
   ```

### Future Roadmap

- [x] Real-time Stream: Integration of WebSockets or Server-Sent Events (SSE) to simulate live industrial traffic and handle asynchronous state updates.

- [x] Advanced Debouncing: Implementing a search debounce for datasets exceeding 50,000 records to further optimize the main thread and prevent UI stuttering.

- A11y Compliance: Further enhancement of ARIA labels, focus management, and keyboard navigation for full WCAG compliance in enterprise environments.

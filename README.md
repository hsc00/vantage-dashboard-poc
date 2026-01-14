# Vantage Analytics Dashboard

A high-performance Cybersecurity Alert Dashboard implementation, inspired by the **Nozomi Networks Vantage** product. This project focuses on data density, rendering efficiency, and logical robustness in mission critical environments.

## Key Features

- **Data Virtualization:** Implemented `@tanstack/react-virtual` to handle thousands of security logs while maintaining a smooth 60 FPS by rendering only the visible viewport.
- **Multi-level Filtering:** Combined real-time severity filters and a global search engine (supporting both Message and Source IP).
- **Smart State Architecture:** Logic centralized in custom Hooks with `useMemo` optimizations to prevent unnecessary re calculations during state updates.
- **Enterprise UI:** A professional dark mode UI built with Tailwind CSS and Lucide Icons, optimized for high-density information display, inspired by the Nozomi Vantage images available online.

## Tech Stack

- **React 18** (Vite)
- **TypeScript** (Strictly typed interfaces for Alerts and Filters)
- **Tailwind CSS** (Utility-first styling with extracted constant patterns)
- **Vitest & React Testing Library** (Unit & Integration Testing)
- **Lucide React** (Industry-standard iconography)

## Engineering Insights

### 1. Performance at Scale

In industrial monitoring, alert logs can grow exponentially. Instead of bloating the DOM, I used **Virtualization**. This ensures the browser only processes the rows currently in view, allowing the dashboard to scale to massive datasets without UI lag.

### 2. Testing Strategy & Reliability

I followed a testing strategy focused on high-value coverage:

- **Business Logic:** Unit tests for sorting algorithms and data normalization.
- **Custom Hooks:** Isolated testing of `useAlertFilters` to ensure search logic is bulletproof, including locale sensitive comparisons to handle international character sets.
- **Component Integration:** Verifying that user interactions (filtering, searching, clearing) correctly update the virtualized list.

### 3. Maintainability & "Clean Code"

To avoid the common "utility class soup" in Tailwind projects, I extracted complex styling patterns into static constants at the bottom of component files. This separates **Layout Structure** from **Styling Configuration**, making the code more readable and easier to audit during Peer Reviews.

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

- Real-time Stream: Integration of WebSockets or Server-Sent Events (SSE) to simulate live industrial traffic and handle asynchronous state updates.

- Advanced Debouncing: Implementing a search debounce for datasets exceeding 50,000 records to further optimize the main thread and prevent UI stuttering.

- A11y Compliance: Further enhancement of ARIA labels, focus management, and keyboard navigation for full WCAG compliance in enterprise environments.

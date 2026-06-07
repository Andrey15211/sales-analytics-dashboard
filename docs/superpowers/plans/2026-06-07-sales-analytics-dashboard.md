# Sales Analytics Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone sales analytics SPA with CSV ingestion, period analytics, charts, and an interactive orders table.

**Architecture:** Vite React owns the client shell and local state. Pure TypeScript utilities transform typed orders into KPIs and chart series, while focused components render dashboard, charts, upload, and table behavior.

**Tech Stack:** React, Vite, TypeScript, Tailwind CSS, Recharts, TanStack Table, PapaParse, Vitest

---

### Task 1: Project Foundation

**Files:** `package.json`, Vite/TypeScript/Tailwind configuration, `src/main.tsx`, `src/index.css`

- [ ] Create package configuration and application entry.
- [ ] Install runtime and development dependencies.
- [ ] Confirm the test runner starts.

### Task 2: Domain Analytics

**Files:** `src/types/order.ts`, `src/utils/analytics.ts`, `src/utils/analytics.test.ts`

- [ ] Write failing tests for KPI calculations, period filtering, trend comparison, and aggregations.
- [ ] Run tests and confirm failures are caused by missing implementation.
- [ ] Implement minimal typed analytics utilities.
- [ ] Run tests and confirm they pass.

### Task 3: CSV Pipeline and Demo Data

**Files:** `src/utils/csv.ts`, `src/utils/csv.test.ts`, `src/data/demoOrders.ts`

- [ ] Write failing tests for valid parsing and invalid schema/value handling.
- [ ] Run tests and confirm expected failures.
- [ ] Implement PapaParse normalization and validation.
- [ ] Generate at least 80 deterministic realistic orders.
- [ ] Run tests and confirm they pass.

### Task 4: Dashboard UI

**Files:** `src/App.tsx`, `src/components/dashboard/*`, `src/components/charts/*`

- [ ] Implement the responsive BI shell, date controls, CSV upload, KPI cards, and state messaging.
- [ ] Implement daily revenue, category orders, product revenue, and status charts.
- [ ] Verify period controls and uploaded data update every dashboard surface.

### Task 5: Orders Table

**Files:** `src/components/table/OrdersTable.tsx`

- [ ] Implement TanStack sorting, global search, category/status filters, and pagination.
- [ ] Format dates and RUB amounts with Russian locale.
- [ ] Verify empty results and horizontal overflow behavior.

### Task 6: Documentation and Verification

**Files:** `README.md`, `.gitignore`, `.env.example`

- [ ] Document the goal, stack, analytics, CSV schema/example, setup, deployment, and demonstrated skills.
- [ ] Run unit tests and production build.
- [ ] Inspect desktop and mobile UI through CloakBrowser and fix visual or interaction defects.

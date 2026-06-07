# Sales Analytics Dashboard Design

## Goal

Build a standalone portfolio case study that demonstrates CSV ingestion, business KPI calculations, chart-ready aggregation, and practical tabular data exploration.

## Product Structure

The app is a single-page Vite React dashboard. A compact sidebar establishes the BI product shell. The header contains date presets and CSV upload. Five KPI cards summarize the selected period, followed by a large daily revenue chart, three supporting charts, and a dominant orders table.

## Visual System

- Light cool-gray canvas with true white surfaces.
- Blue primary accent, violet secondary accent, and restrained semantic green, amber, and red.
- Inter-like sans-serif typography with strong numeric hierarchy.
- Thin borders, subtle shadows, 12-16px radii, and practical spacing.
- Desktop-first information density with responsive stacking and horizontal table scrolling.

## Data Flow

Demo data is used at startup. Date controls filter the active dataset. KPI, trend, and chart calculations are pure utilities derived from the active period. A valid CSV replaces the demo dataset in memory; invalid files preserve the current dataset and show a specific error.

## Modules

- `src/types/order.ts`: domain types and expected CSV schema.
- `src/data/demoOrders.ts`: deterministic realistic demo orders.
- `src/utils/analytics.ts`: filtering, KPI, previous-period comparison, and chart aggregations.
- `src/utils/csv.ts`: PapaParse integration, normalization, and validation.
- `src/components/dashboard`: shell, controls, KPIs, and states.
- `src/components/charts`: Recharts visualizations.
- `src/components/table`: TanStack Table sorting, search, filters, and pagination.

## States and Accessibility

CSV parsing shows a loading state. Invalid schema, invalid values, and empty files produce actionable errors. Empty filtered periods render explicit chart and table states. Upload is keyboard accessible and labelled; controls retain visible focus states.

## Verification

Vitest covers analytics and CSV validation. Production TypeScript build must pass. CloakBrowser verifies desktop and mobile layouts, period switching, filters, sorting, pagination, and CSV error handling.

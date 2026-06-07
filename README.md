# Sales Analytics Dashboard

A standalone portfolio case study for sales data ingestion, validation, analytics, visualization, and table exploration. Russian is the default interface language; users can switch the complete UI to English.

## Description

The application starts with a deterministic demo dataset of 120 orders. Users can inspect KPIs and charts, change the reporting period, search and filter orders, or upload a CSV file to replace the demo data in memory.

No backend, account, API key, or external data service is required.

## Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Recharts
- TanStack Table
- PapaParse
- Vitest

## Features

- Total revenue, order count, average order value, and unique customer KPIs
- Revenue change compared with the preceding period of equal length
- Today, week, month, and custom date ranges
- Daily revenue chart with zero-value days included
- Orders by category
- Top products by revenue
- Order status distribution
- Sortable and paginated order table
- Search by order ID, customer, or product
- Category and status filters
- Russian date and RUB price formatting
- Loading, validation error, chart empty, and table empty states
- Responsive desktop, tablet, and mobile layouts

## RU/EN Localization

- Russian (`ru`) is the default language.
- The header contains a persistent `RU / EN` switch.
- UI copy is stored in typed dictionaries in `src/i18n/index.ts`.
- Navigation, controls, KPIs, charts, tables, filters, status labels, errors, loading states, empty states, dates, and numbers follow the selected locale.
- Internal order statuses use stable language-independent codes.
- CSV files may use either Russian or English status values.

Supported status values:

| Internal code | Russian CSV | English CSV |
| --- | --- | --- |
| `delivered` | `Доставлен` | `Delivered` |
| `processing` | `В обработке` | `Processing` |
| `cancelled` | `Отменен` | `Cancelled` |
| `returned` | `Возврат` | `Returned` |

## CSV Format

Required columns:

```csv
id,date,customer,product,category,quantity,price,status
ORD-12001,2026-06-01,Anna Smirnova,ProBook 14,electronics,1,129990,Delivered
ORD-12002,2026-06-02,Ivan Popov,Ergo Plus Chair,furniture,2,38990,Processing
```

Validation rules:

- `date`: `YYYY-MM-DD`
- `quantity`: positive integer
- `price`: positive number representing the unit price in RUB
- `status`: one of the supported Russian or English values above
- Every required field must be present and non-empty

If any row is invalid, the upload is rejected, the current dataset remains active, and a localized error is displayed.

## Local Setup

Prerequisite: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Checks

```bash
npm test
npm run typecheck
npm run build
npm audit
```

Preview the production build:

```bash
npm run preview
```

## Environment Variables

The project currently uses no environment variables. `.env.example` documents this explicitly. Never commit local `.env` files or secrets.

## Vercel Deployment

1. Import the GitHub repository into Vercel.
2. Select the Vite framework preset.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Deploy without environment variables.

## Portfolio Skills Demonstrated

- Typed domain modeling
- CSV parsing, normalization, and schema validation
- Localized validation feedback
- Date-window filtering and previous-period comparison
- KPI and grouped aggregation calculations
- Chart-ready data transformations
- Interactive data-table workflows
- Typed RU/EN localization
- Responsive business dashboard design
- Automated unit, type, build, and dependency checks

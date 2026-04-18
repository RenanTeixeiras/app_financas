# Sprint 5 Status

## Overview

Sprint 5 focused on turning the `reports` module into a real analytical screen, connected to the database and consistent with the dashboard evolution delivered in the previous sprint.

While Sprint 4 consolidated the quick monthly view in `dashboard`, Sprint 5 pushed the product toward a more complete analysis layer, with monthly trend, report-oriented breakdowns, loading states, and a visual polish pass across the main screens.

---

## Sprint 5 Goal

Implement a real reports screen, allowing the user to:

- see monthly summary in `/reports`
- change the month through query string
- follow recent-month trend
- review expense breakdown by category
- review income breakdown by category
- perceive clearer loading states during navigation
- use the app with better visual finish

---

## Existing Base Before the Implementation

Before this sprint, the project already had:

- Supabase authentication
- server-side guard on private routes
- functional `entries` module
- functional `dashboard` module
- `getMonthlySummary(...)`
- `getCategoryBreakdown(...)`
- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- dashboard and reports revalidation in entry actions

In other words, the core infrastructure was already ready. What was missing was building the analytical `reports` layer, adding monthly trend, and improving the perception of loading and finish across the app.

---

## What Was Implemented

## 1. Real reports screen at `/reports`

The `/reports` route, which had been only a visual placeholder, now uses real database data.

Implemented:

- `searchParams.month` reading
- fallback to current month when the filter is invalid
- real monthly summary
- monthly trend chart
- expense breakdown by category
- income breakdown by category
- empty state for months without activity

With that, `reports` stopped being a reserved screen and became a functional product module.

---

## 2. Monthly trend with `Recharts`

`Recharts` was added to the project and a monthly trend chart was implemented.

This chart shows:

- income
- expenses
- balance

across recent months, keeping the reading simple and clear on desktop and mobile.

The case where there is not enough history for useful context was also handled.

---

## 3. New reports query

The following query was created:

- `getMonthlyTrend(userId, months, endMonth)`

This query:

- filters by authenticated user
- groups by month
- sums income and expenses
- calculates balance
- fills zero-value months to keep the chart visually consistent

This completed the missing data layer for the reports module.

---

## 4. Reuse and extension of what already existed

Instead of duplicating logic, the reports screen now reuses:

- `getMonthlySummary(...)`
- `getCategoryBreakdown(...)`
- `getMonthRange(...)`
- currency and month formatters

This approach kept the sprint lean, consistent, and aligned with the app's current architecture.

---

## 5. Dedicated `reports` components

Specific module components were created:

- `reports-month-filter.tsx`
- `reports-stat-cards.tsx`
- `reports-breakdown-section.tsx`
- `monthly-trend-chart.tsx`
- `reports-skeleton.tsx`

This split kept `page.tsx` focused on data composition and made rendering clearer and easier to evolve.

---

## 6. Loading states and skeletons

A simple loading-state structure was created for the main private routes.

Added files:

- `/dashboard/loading.tsx`
- `/entries/loading.tsx`
- `/categories/loading.tsx`
- `/reports/loading.tsx`
- `components/ui/loading-skeleton.tsx`

With that, navigation now has more consistent visual feedback, reducing the harsh feel of route transitions in server-rendered pages.

---

## 7. Visual polish and stale text

A copy and finish pass was also made in places that still showed old project messaging.

Applied adjustments in:

- landing page
- sidebar

This removed outdated references to `Sprint 1` and aligned the interface more closely with the real state of the product.

---

## 8. Utility adjustments

Helpers were added to support the new analytical layer:

- `getRecentMonthValues(...)`
- `formatMonthShortLabel(...)`
- `formatCompactCurrencyFromCents(...)`

These helpers were used mainly in the chart and in the time-based aggregation of reports.

---

## Files Created in Sprint 5

### Queries

- `app/src/lib/db/queries/reports.ts`

### Components

- `app/src/components/ui/loading-skeleton.tsx`
- `app/src/components/reports/reports-month-filter.tsx`
- `app/src/components/reports/reports-stat-cards.tsx`
- `app/src/components/reports/reports-breakdown-section.tsx`
- `app/src/components/reports/monthly-trend-chart.tsx`
- `app/src/components/reports/reports-skeleton.tsx`

### Loading states

- `app/src/app/(app)/reports/loading.tsx`
- `app/src/app/(app)/dashboard/loading.tsx`
- `app/src/app/(app)/entries/loading.tsx`
- `app/src/app/(app)/categories/loading.tsx`

---

## Files Changed in Sprint 5

- `app/src/app/(app)/reports/page.tsx`
- `app/src/lib/utils/date.ts`
- `app/src/lib/utils/currency.ts`
- `app/src/app/page.tsx`
- `app/src/components/app-shell/sidebar.tsx`
- `app/package.json`
- `app/package-lock.json`

---

## Flows Already Working

With what was delivered in this sprint, the user can now:

1. open the reports screen
2. change the analysis month
3. view monthly summary in reports
4. follow recent-month trend
5. review expense breakdown by category
6. review income breakdown by category
7. perceive better loading states during navigation

---

## Technical Verification

After Sprint 5 implementation, it was validated that:

- `npm run lint` passes
- `npm run build` passes

This confirms the sprint is consistent in compilation, typing, and route structure.

---

## Current State of Sprint 5

At this point, Sprint 5 is implemented in its main functional core.

There is already:

- real reports screen
- monthly trend with `Recharts`
- analytical breakdowns in `reports`
- loading states for the main private routes
- improved copy and visual finish

The `reports` module stopped being a placeholder and now complements the dashboard as the analytical layer of the MVP.

---

## What Can Still Evolve Later

Even with Sprint 5 implemented, there are still natural evolutions for the next stages:

- export
- real settings in `/settings`
- final PWA refinement
- deeper accessibility work
- final performance review
- final deployment

---

## Conclusion

Sprint 5 moved the project from a product with functional `entries` and `dashboard` to an app that already offers a more complete analytical view in `reports`.

With that, the MVP now has three modules that are truly useful in day-to-day usage:

- entries
- dashboard
- reports

This step strengthens the product's maturity and better prepares the ground for the final MVP refinement stage.

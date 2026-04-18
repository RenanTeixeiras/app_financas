# Sprint 4 Implementation

## Goal

This document records, in a direct way, what was implemented in code to complete Sprint 4 of the `app_financas` project.

The focus of this sprint was turning the dashboard into a real monthly screen, connected to the database and ready for daily use.

---

## What Changed

### 1. The `/dashboard` route stopped being a placeholder

The file `app/src/app/(app)/dashboard/page.tsx` was reworked to:

- require an authenticated user
- read `searchParams.month`
- calculate the real month range with `getMonthRange(...)`
- load dashboard data on the server
- render cards, recent entries list, and category breakdowns

Fallback to the current month was also added when the query string contains an invalid value.

---

### 2. A new category aggregation query was created

Created file:

- `app/src/lib/db/queries/dashboard.ts`

Created function:

- `getCategoryBreakdown(userId, start, end, type)`

This query:

- filters by user
- filters by date range
- filters by type (`income` or `expense`)
- groups by category
- sums category values
- orders from highest to lowest total
- calculates each category's percentage share within the total of the same type

---

### 3. Dedicated dashboard components were created

Created files:

- `app/src/components/dashboard/dashboard-month-filter.tsx`
- `app/src/components/dashboard/dashboard-stat-cards.tsx`
- `app/src/components/dashboard/dashboard-recent-entries.tsx`
- `app/src/components/dashboard/dashboard-category-breakdown.tsx`

Responsibilities:

- `dashboard-month-filter.tsx`: month filter and actions to update or return to the current month
- `dashboard-stat-cards.tsx`: income, expense, and balance cards
- `dashboard-recent-entries.tsx`: rendering of the user's 5 most recent entries overall
- `dashboard-category-breakdown.tsx`: visual category list with total and percentage

---

### 4. A helper was added to display the month in the header

Changed file:

- `app/src/lib/utils/date.ts`

Added function:

- `formatMonthLabel(...)`

This helper is used to show a friendly month label in the dashboard header.

---

## Applied Decisions

### Recent entries

By sprint decision, the recent entries section was implemented like this:

- it shows the user's 5 most recent entries overall
- it is not limited to the dashboard's selected month

This keeps the section more useful as a quick-consultation panel.

### Breakdown without chart library

The breakdown was implemented as a simple visual list, without adding any external chart dependency.

Reasons:

- lower risk
- faster delivery
- less visual complexity
- prepares the base for future evolution

### Server-side dashboard

The dashboard remained a server component, fetching data directly from the queries.

Reasons:

- simplicity
- consistency with the current architecture
- fewer intermediate layers

---

## Covered States

During implementation, the following scenarios were handled:

- month with no activity
- month with no expenses
- month with no income
- complete absence of recent entries
- invalid `month` in query string

---

## Impacted Files

### Created

- `app/src/lib/db/queries/dashboard.ts`
- `app/src/components/dashboard/dashboard-month-filter.tsx`
- `app/src/components/dashboard/dashboard-stat-cards.tsx`
- `app/src/components/dashboard/dashboard-recent-entries.tsx`
- `app/src/components/dashboard/dashboard-category-breakdown.tsx`

### Changed

- `app/src/app/(app)/dashboard/page.tsx`
- `app/src/lib/utils/date.ts`

---

## Verification

After implementation, it was validated that:

- `npm run lint` passes
- `npm run build` passes

---

## Final Result

At the end of Sprint 4, the dashboard now delivers:

- real monthly summary
- month selection
- recent entries
- expense breakdown by category
- income breakdown by category
- clear empty states

In practice, this put the dashboard into the expected MVP state: a screen that is genuinely useful for a quick monthly read.

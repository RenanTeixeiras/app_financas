# Sprint 4 Status

## Overview

Sprint 4 focused on turning the `dashboard` module into a real monthly screen, connected to the database and useful in daily usage.

The technical base for this already existed from previous sprints: authentication, server-side protection, schema with `entries` and `categories`, monthly summary and recent entries queries, date and currency utilities, and dashboard revalidation in the entry actions.

The main work in this sprint was composing those resources into a server-side screen consistent with the rest of the app, while adding the missing aggregation needed for category breakdowns.

---

## Sprint 4 Goal

Implement a real monthly dashboard, allowing the user to:

- see monthly income
- see monthly expenses
- see monthly net balance
- review recent entries
- understand expense breakdown by category
- understand income breakdown by category
- switch the month through query string
- use the screen with a good mobile experience

---

## Existing Base Before the Implementation

Before this sprint, the project already had:

- Supabase authentication
- server-side guard on private routes
- functional entries page
- `getMonthlySummary(...)`
- `getRecentEntries(...)`
- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- dashboard revalidation in `entries` actions

In other words, most of the required infrastructure was already in place. What was missing was turning `/dashboard` into a true consolidated monthly view.

---

## What Was Implemented

## 1. Real dashboard at `/dashboard`

The `/dashboard` route, which used to be a placeholder with fixed values, now uses real database data.

Implemented:

- month reading through `searchParams`
- conversion of the selected month into a real `start/end` range
- server-side dashboard data loading
- cards with real monthly summary
- recent entries list
- expense breakdown by category
- income breakdown by category
- real empty states
- warning when the provided month is invalid

With that, the dashboard stopped being a presentation screen and became a functional product module.

---

## 2. Monthly filter via query string

Month filtering was implemented on `/dashboard`, following the same principle already used in `entries`.

Usage example:

- `?month=2026-04`

Applied behavior:

- read month from the URL
- use `getMonthRange(...)` to derive `start/end`
- automatically fall back to the current month when the provided value is invalid
- show a visual message when the filter is corrected automatically

This kept the screen simple, predictable, and URL-friendly.

---

## 3. Monthly summary cards

The top cards were connected to `getMonthlySummary(...)`.

The screen now shows real data for:

- monthly income
- monthly expenses
- net balance

The displayed values respect the selected month and use the project's currency formatting.

---

## 4. Recent entries

A dedicated section for the user's recent entries was created.

Decision applied in this sprint:

- show the user's 5 most recent entries overall
- do not limit this list to the dashboard's selected month

Each item shows:

- description
- category
- date
- amount
- visual differentiation between income and expense
- link to the entry edit screen

An empty state was also added for when no entries exist yet.

---

## 5. Expense breakdown by category

A new aggregated dashboard query was implemented:

- `getCategoryBreakdown(userId, start, end, type)`

This query:

- filters by authenticated user
- filters by the selected month range
- filters by type (`expense` or `income`)
- groups by category
- sums values per category
- orders from highest to lowest amount
- calculates percentage share relative to the total of the same type

With that, the dashboard now displays a visual list of expense categories with total amount and percentage share.

---

## 6. Income breakdown by category

The same aggregated query was reused for income.

That kept:

- a single aggregation rule
- less duplicated logic
- consistency between expense and income breakdowns

Each category shows:

- name
- color
- total received
- percentage within the month's total income

---

## 7. Dedicated dashboard components

To organize the screen and avoid concentrating the whole implementation in `page.tsx`, dedicated components were created for the module.

Created components:

- `dashboard-month-filter.tsx`
- `dashboard-stat-cards.tsx`
- `dashboard-recent-entries.tsx`
- `dashboard-category-breakdown.tsx`

This split kept the main page focused on data composition and made rendering clearer and easier to maintain.

---

## 8. Date utility adjustment

The following helper was added to `lib/utils/date.ts`:

- `formatMonthLabel(...)`

It is used to turn the query string month value into a friendly label in the dashboard header.

---

## 9. Empty states and fallback behavior

States were added for:

- dashboard with no monthly activity
- no expenses in the month
- no income in the month
- no recent entries

An invalid month now also falls back to the current month, preventing incorrect or ambiguous behavior.

---

## Files Created in Sprint 4

### Queries

- `app/src/lib/db/queries/dashboard.ts`

### Components

- `app/src/components/dashboard/dashboard-month-filter.tsx`
- `app/src/components/dashboard/dashboard-stat-cards.tsx`
- `app/src/components/dashboard/dashboard-recent-entries.tsx`
- `app/src/components/dashboard/dashboard-category-breakdown.tsx`

---

## Files Changed in Sprint 4

- `app/src/app/(app)/dashboard/page.tsx`
- `app/src/lib/utils/date.ts`

---

## Flows Already Working

With what was delivered in this sprint, the user can now:

1. open the dashboard
2. see income for the current month
3. see expenses for the current month
4. see the net balance for the current month
5. change the month through the interface
6. see the dashboard update according to the selected month
7. review the user's recent entries
8. identify which categories concentrate the most monthly expenses
9. identify which categories concentrate the most monthly income

---

## Technical Verification

After Sprint 4 implementation, it was validated that:

- `npm run lint` passes
- `npm run build` passes

This confirms the sprint is consistent in compilation, typing, and route structure.

---

## Current State of Sprint 4

At this point, Sprint 4 is complete within the planned scope.

There is already:

- real monthly dashboard
- monthly financial summary cards
- month filter via query string
- recent entries list
- expense breakdown by category
- income breakdown by category
- clear empty states
- experience consistent with the app's current mobile-first layout

The `dashboard` module stopped being a placeholder and became a functional part of the MVP.

---

## What Remains for Later

Items that remain out of scope for Sprint 4:

- charts with an external library
- month-over-month comparison
- monthly trend
- more complete reports
- export
- configurable widgets

These points are left for future sprints, especially the evolution of reports.

---

## Conclusion

Sprint 4 moved the project from an app with functional entries and categories to a product that already offers a consolidated monthly view to the user.

With this, the MVP now has two modules that are truly useful in day-to-day use:

- entries
- dashboard

This strengthens the product's practical usefulness and better prepares the ground for the next reporting stage.

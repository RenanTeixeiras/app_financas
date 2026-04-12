# Sprint 4 - Real Dashboard

## Goal

Turn the `/dashboard` route into a real monthly product dashboard, using database data to show financial summary, recent entries, and category breakdown.

By the end of Sprint 4, the dashboard should stop being a placeholder screen and become the main consolidated monthly view for the user.

---

## Expected Outcome

By the end of Sprint 4, the user should be able to:

1. see total monthly income
2. see total monthly expenses
3. see net monthly balance
4. see recent entries
5. see expense breakdown by category
6. see income breakdown by category
7. switch the dashboard month
8. use the dashboard comfortably on mobile

The focus of this sprint is not advanced charts, but a real, reliable, and useful monthly dashboard.

---

## Sprint 4 Scope

### Included

1. dashboard with real database data
2. monthly summary cards
3. dashboard month filter
4. recent entries list
5. expense breakdown by category
6. income breakdown by category
7. real empty states
8. mobile-first experience

### Out of Sprint 4

1. chart library integration
2. previous-month comparison
3. monthly trend
4. full reports
5. export
6. configurable widgets
7. dashboard settings

---

## Dependencies Already Ready

This sprint builds on what was completed in previous sprints:

- Supabase authentication
- server-side guard
- database schema with `entries` and `categories`
- functional entries page
- `getMonthlySummary(...)`
- `getRecentEntries(...)`
- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- dashboard revalidation in entry actions

So Sprint 4 depends more on screen composition and aggregation than on new infrastructure.

---

## Functional Objectives

### 1. Real Monthly Summary

The dashboard must show:

- monthly income
- monthly expenses
- net monthly balance

These values must respect the selected month.

### 2. Recent Entries

The dashboard should display a compact list of the user's latest entries, containing:

- description
- category
- date
- amount
- clear visual distinction between income and expense

### 3. Expense Breakdown by Category

The dashboard should show a list of expense categories for the month, ordered by highest value.

Each item should show:

- category name
- category color
- total spent
- percentage relative to the month's total expenses

### 4. Income Breakdown by Category

The dashboard should show a list of income categories for the month, ordered by highest value.

Each item should show:

- category name
- category color
- total received
- percentage relative to the month's total income

### 5. Month Filter

The dashboard must accept month filtering through query string.

Example:

- `?month=2026-04`

The UI must convert the selected month into a real date range for the database query.

---

## Expected UX Flow

### Main flow

1. open app
2. go to `Dashboard`
3. see the current month summary
4. see recent entries
5. see expense and income breakdown
6. switch month
7. see the data update

### Quick consultation flow

1. open dashboard
2. identify the monthly balance
3. identify where the money went
4. identify where the money came from
5. navigate to `Entries` if deeper review is needed

---

## Sprint 4 Screen

### `/dashboard`

Main screen of the sprint.

It must contain:

- dashboard header
- month selector
- summary cards
- recent entries list
- expense breakdown
- income breakdown
- appropriate empty states and messages

---

## Recommended Component Structure

### `dashboard` Components

Create:

- `dashboard-month-filter.tsx`
- `dashboard-stat-cards.tsx`
- `dashboard-recent-entries.tsx`
- `dashboard-category-breakdown.tsx`

### Responsibility of Each One

#### `dashboard-month-filter.tsx`

Responsible for:

- selecting the month
- updating the query string
- keeping interaction simple on mobile

#### `dashboard-stat-cards.tsx`

Responsible for:

- showing income
- showing expenses
- showing net balance

#### `dashboard-recent-entries.tsx`

Responsible for:

- showing recent entries
- displaying an empty state when there are no items
- taking the user to `entries` or to item editing

#### `dashboard-category-breakdown.tsx`

Responsible for:

- rendering category breakdown
- showing total amount
- showing percentage
- showing the sorted list
- supporting both `income` and `expense`

---

## Expected File Structure

```txt
src/
  app/
    (app)/
      dashboard/
        page.tsx

  components/
    dashboard/
      dashboard-month-filter.tsx
      dashboard-stat-cards.tsx
      dashboard-recent-entries.tsx
      dashboard-category-breakdown.tsx

  lib/
    db/
      queries/
        dashboard.ts
        entries.ts
    utils/
      date.ts
      currency.ts
```

---

## Required Queries

### Already existing and reused

- `getMonthlySummary(userId, start, end)`
- `getRecentEntries(userId, limit)`

### New query for Sprint 4

Create in `lib/db/queries/dashboard.ts`:

#### `getCategoryBreakdown(userId, start, end, type)`

Responsible for returning category aggregation for the selected month.

Expected parameters:

- `userId`
- `start`
- `end`
- `type`: `income` or `expense`

Expected item return:

- `categoryId`
- `name`
- `color`
- `total`
- `share`

Rules:

- consider only entries from the authenticated user
- consider only the selected month range
- group by category
- order by highest total
- calculate percentage relative to the total of the same type
- if the total is zero, percentage must be zero

---

## Implementation Strategy

### Step 1: Dashboard monthly filter

Implement `searchParams.month` handling in `/dashboard`.

The flow must:

1. read the month from the URL
2. use `getMonthRange(...)`
3. define the real `start/end` range

### Step 2: Summary cards with real data

Replace the fixed values with `getMonthlySummary(...)`.

The cards must reflect:

- income
- expenses
- balance

### Step 3: Recent entries

Use `getRecentEntries(...)` to render the recent entries.

In this sprint, showing the latest 5 items is enough.

### Step 4: Expense breakdown

Create the new aggregate query and show a simple visual list of expense categories.

### Step 5: Income breakdown

Reuse the same aggregate query to show income categories.

### Step 6: Empty states

Add states for:

- dashboard without data in the month
- no expenses in the month
- no income in the month
- no recent entries

### Step 7: Minimal polish

Guarantee:

- good readability on mobile
- layout consistent with the app shell
- clear visual hierarchy

---

## Important Technical Details

### 1. Server component-based dashboard

The `/dashboard` page should remain server-side, fetching data directly from queries.

Reason:

- simplicity
- consistency with the current architecture
- no need for an extra API layer

### 2. Query-string filter

The month should follow the same principle used on the `entries` screen, with a simple query string.

Example:

- `/dashboard?month=2026-04`

### 3. No chart library in this sprint

The breakdown will be delivered as a simple visual list, without adding new dependencies.

Reason:

- lower risk
- lower coupling
- faster delivery
- prepares the ground for Sprint 5

### 4. Reuse the existing helpers

Reuse as much as possible:

- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- patterns already used in `entries`

---

## Business Rules

1. dashboard only shows data from the authenticated user
2. summary only considers the selected month
3. expense breakdown only considers `expense`
4. income breakdown only considers `income`
5. percentages must be calculated by type, not by overall total
6. lists must be ordered from highest to lowest amount
7. if there is no data, the UI must show a clear empty state

---

## Definition of Done Criteria

Sprint 4 should only be considered complete when:

1. `/dashboard` uses real database data
2. cards show income, expenses, and balance correctly
3. the month can be changed via query string
4. recent entries appear correctly
5. expense breakdown works
6. income breakdown works
7. empty states appear correctly
8. the screen works well on mobile
9. `lint` and `build` pass

---

## Recommended Manual Tests

### Monthly summary

1. verify monthly income
2. verify monthly expenses
3. verify net balance

### Month

1. change the month
2. confirm cards update
3. confirm breakdown updates
4. confirm recent entries remain coherent

### Breakdown

1. verify expense categories
2. verify income categories
3. verify highest-value ordering
4. verify percentage calculation

### Empty states

1. month without entries
2. month without income
3. month without expenses

### Mobile

1. validate cards on a small screen
2. validate stacked lists
3. validate amount readability

---

## Sprint 4 Risks

1. dashboard becomes visually heavy
2. breakdown becomes confusing without clear hierarchy
3. logic gets duplicated between dashboard and entries
4. trying to add charts too early

---

## Mitigations

1. keep the layout simple and clear
2. use visual lists before charts
3. reuse existing helpers and queries
4. stay focused on fast reading and real usefulness

---

## Recommended Execution Order

1. create `dashboard.ts` with the breakdown query
2. implement the monthly filter in the dashboard
3. connect cards with `getMonthlySummary(...)`
4. connect recent entries with `getRecentEntries(...)`
5. implement expense breakdown
6. implement income breakdown
7. add empty states
8. review mobile UX
9. run `lint` and `build`

---

## Done Definition

Sprint 4 will be ready when the dashboard stops being a presentation screen and becomes a real monthly product view, clearly showing what came in, what went out, and where each type of value is concentrated.

# Sprint 5 - Reports and Polish

## Goal

Turn the `/reports` route into a real reporting screen for the product, using database data to show monthly summary, monthly trend, and analytical breakdowns for income and expenses.

By the end of Sprint 5, the app should move beyond having only a functional dashboard and start offering a more complete analytical layer, with better empty states, loading states, and overall visual polish.

---

## Expected Result

By the end of Sprint 5, the user should be able to:

1. open a real reports screen at `/reports`
2. change the analysis month through query string
3. see a monthly summary in the reports screen
4. see a monthly trend for recent months
5. see expense breakdown by category
6. see income breakdown by category
7. perceive clearer loading states during navigation
8. find more consistent empty states across the app
9. use `dashboard`, `entries`, `categories`, and `reports` with better visual and responsive polish

---

## Sprint 5 Scope

### Included

1. real reports screen
2. month filter in `/reports`
3. monthly summary in reports
4. monthly trend with `Recharts`
5. expense breakdown by category in reports
6. income breakdown by category in reports
7. better empty states
8. skeletons and loading states in the main routes
9. additional visual polish
10. complete responsiveness review across the main screens
11. update old UI copy that still mentions past sprint stages

### Out of Sprint 5

1. export
2. real settings in `/settings`
3. advanced comparison between arbitrary periods
4. configurable widgets
5. final PWA refinement
6. advanced microinteractions
7. full accessibility audit
8. deep performance review
9. final deployment

---

## Existing Dependencies Already Ready

This sprint builds on what has already been completed in previous sprints:

- Supabase authentication
- server-side guard
- database schema with `entries` and `categories`
- functional entries page
- functional dashboard page
- `getMonthlySummary(...)`
- `getRecentEntries(...)`
- `getCategoryBreakdown(...)`
- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- dashboard and reports revalidation in entry actions

In other words, Sprint 5 depends mainly on a new screen composition in `reports`, on aggregated queries for monthly trend, and on a polish pass across the app.

---

## Functional Goals

### 1. Real reports screen

The `/reports` route must stop being a placeholder and start rendering real data for the authenticated user.

It must contain:

- reports header
- month selector
- summary cards
- monthly trend chart
- expense breakdown
- income breakdown
- appropriate empty states

### 2. Month filter

The screen must accept month filtering through query string.

Example:

- `?month=2026-04`

Expected behavior:

- read the month from the URL
- convert it into real `start/end` bounds with `getMonthRange(...)`
- fall back to the current month if the value is invalid
- visually notify the user when the filter is corrected automatically

### 3. Monthly summary in reports

The screen must show, for the selected month:

- total income
- total expenses
- net balance

This can reuse the same logic already used in the dashboard.

### 4. Monthly trend

The screen must show a recent-month trend using `Recharts`.

Minimum data per month:

- month
- income
- expense
- balance

Closed scope for this sprint:

- simple and readable chart
- good mobile readability
- no excessive visual configuration

### 5. Expense breakdown by category

Must show expense categories for the selected month with:

- name
- color
- total
- percentage

### 6. Income breakdown by category

Must show income categories for the selected month with:

- name
- color
- total
- percentage

### 7. Better empty states

Improve empty states in:

- `reports`
- `dashboard`
- `entries`
- `categories`, if needed

Goal:

- more clarity
- better visual hierarchy
- CTA when appropriate

### 8. Loading states and skeletons

Add loading states for the main private routes:

- `/dashboard`
- `/entries`
- `/categories`
- `/reports`

### 9. Visual and responsive polish

Review visual finish and responsiveness in:

- `dashboard`
- `entries`
- `categories`
- `reports`
- landing page
- sidebar

Also fix stale UI text that still indicates Sprint 1 or older project states.

---

## Expected UX Flow

### Main reports flow

1. open app
2. enter `Reports`
3. view current month summary
4. review recent-month trend
5. view expense and income breakdowns
6. change month
7. see updated data

### Analytical consultation flow

1. open reports
2. understand whether balance is improving or worsening
3. identify patterns in income and expenses over recent months
4. identify the most relevant categories in the selected month
5. navigate to `Entries` to investigate further if needed

---

## Sprint 5 Screen

### `/reports`

Main screen of the sprint.

It must contain:

- page header
- month selector
- monthly summary cards
- monthly trend chart
- expense breakdown
- income breakdown
- empty states
- invalid-filter feedback, if needed

---

## Recommended Component Structure

### `reports` components

Create:

- `reports-month-filter.tsx`
- `reports-stat-cards.tsx`
- `monthly-trend-chart.tsx`
- `reports-breakdown-section.tsx`
- `reports-skeleton.tsx`

### Recommended shared component

- `loading-skeleton.tsx`

### Responsibility of each one

#### `reports-month-filter.tsx`

Responsible for:

- selecting the month
- updating query string
- keeping interaction simple on mobile

#### `reports-stat-cards.tsx`

Responsible for:

- showing income
- showing expenses
- showing net balance

#### `monthly-trend-chart.tsx`

Responsible for:

- rendering the monthly trend with `Recharts`
- keeping the chart clear on desktop and mobile
- showing an empty state when there is not enough history

#### `reports-breakdown-section.tsx`

Responsible for:

- rendering the category breakdown
- showing total and percentage
- supporting both `income` and `expense`

#### `reports-skeleton.tsx`

Responsible for:

- composing the `/reports` route loading state
- maintaining premium visual perception during loading

---

## Expected File Structure

```txt
src/
  app/
    (app)/
      reports/
        page.tsx
        loading.tsx
      dashboard/
        loading.tsx
      entries/
        loading.tsx
      categories/
        loading.tsx

  components/
    reports/
      reports-month-filter.tsx
      reports-stat-cards.tsx
      monthly-trend-chart.tsx
      reports-breakdown-section.tsx
      reports-skeleton.tsx
    ui/
      loading-skeleton.tsx

  lib/
    db/
      queries/
        reports.ts
        dashboard.ts
        entries.ts
    utils/
      date.ts
      currency.ts
```

---

## Required Queries

### Existing and reused

- `getMonthlySummary(userId, start, end)`
- `getCategoryBreakdown(userId, start, end, type)`
- `getMonthRange(month)`

### New Sprint 5 query

Create in `lib/db/queries/reports.ts`:

#### `getMonthlyTrend(userId, months)`

Responsible for returning recent months with aggregation by type.

Expected parameters:

- `userId`
- `months`: number of months to include, for example `6`

Expected return per item:

- `month`
- `income`
- `expense`
- `balance`

Rules:

- consider only entries from the authenticated user
- group by month
- include zero-value months when necessary to keep the chart consistent
- order from oldest to newest

Optional in the same file:

- `getReportsSnapshot(userId, start, end)` if that simplifies page composition

---

## Implementation Strategy

### Step 1: monthly trend query

Create `reports.ts` with `getMonthlyTrend(...)`.

The goal is to provide the missing analytical layer for the reports screen.

### Step 2: turn `/reports` into a real screen

Replace the current placeholder with a server-side page that:

1. reads `searchParams.month`
2. converts the month into `start/end`
3. loads summary, trend, and breakdowns in parallel
4. renders correct empty states

### Step 3: chart with `Recharts`

Add `Recharts` to the project and implement a simple monthly trend chart.

Recommended visual scope:

- simple lines or bars
- quick readability
- no excessive legends or controls

### Step 4: reports breakdowns

Reuse `getCategoryBreakdown(...)` to show expenses and income in a more analytical layout inside `/reports`.

### Step 5: better empty states

Standardize empty states in the main private screens.

### Step 6: loading states

Add `loading.tsx` to the main private routes and reusable skeletons.

### Step 7: polish and responsiveness

Review visual finish and responsive behavior across the app's main flow.

### Step 8: update stale text

Fix UI copy that still points to old sprint stages or outdated product states.

### Step 9: final verification

Run:

- `npm run lint`
- `npm run build`

---

## Important Technical Details

### 1. Recharts enters in this sprint

Unlike Sprint 4, this sprint now includes a chart.

Closed decision:

- use `Recharts` for monthly trend in `/reports`

Reason:

- the reports screen is the natural place for chart-based visualization
- the planned stack already included `Recharts`
- the scope can remain controlled by introducing only one initial chart

### 2. Reports stays server-side

The `/reports` page should remain a server component, fetching data directly from queries.

The `Recharts` chart can be encapsulated in a client component only if needed.

### 3. Maximum reuse

Reuse as much as possible:

- `getMonthlySummary(...)`
- `getCategoryBreakdown(...)`
- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- visual patterns already used in dashboard and entries

### 4. Controlled chart scope

Do not turn Sprint 5 into a BI sprint.

Keep:

- one main chart
- simple reading
- focus on real usefulness

---

## Business Rules

1. reports only show data for the authenticated user
2. summary respects the selected month
3. expense breakdown considers only `expense`
4. income breakdown considers only `income`
5. monthly trend must consider only data from the authenticated user
6. months with no data must still appear consistently when needed for the chart
7. empty states must be clear and distinct from loading states

---

## Definition of Done Criteria

Sprint 5 should only be considered complete when:

1. `/reports` uses real database data
2. the month can be changed through query string
3. monthly summary appears correctly in reports
4. monthly trend works with `Recharts`
5. expense and income breakdowns work correctly
6. clear empty states exist in the main screens
7. loading states exist in the main private routes
8. the main visual and responsive polish has been applied
9. stale sprint-related UI copy has been corrected
10. `lint` and `build` pass

---

## Recommended Manual Tests

### Reports

1. open `/reports`
2. change the month
3. confirm cards update
4. confirm breakdowns update
5. confirm monthly trend renders correctly

### Empty states

1. user with no entries
2. month with no income
3. month with no expenses
4. short history for trend

### Loading

1. navigate between `dashboard`, `entries`, `categories`, and `reports`
2. validate that loading feels consistent and does not break layout

### Responsiveness

1. validate from `360px` to desktop
2. validate chart on small screens
3. validate readability of cards and lists

---

## Sprint 5 Risks

1. overextending the reports scope
2. duplicating logic between `dashboard` and `reports`
3. making the chart heavy or confusing on mobile
4. mixing cross-app polish with unnecessary refactors

---

## Mitigations

1. limit the sprint to one main chart
2. reuse existing queries and components whenever it makes sense
3. review mobile behavior early, not only at the end
4. keep polish as the final step of the sprint

---

## Recommended Execution Order

1. add `Recharts`
2. create `reports.ts` with monthly trend query
3. implement `/reports` with real data
4. connect monthly summary and breakdowns
5. implement monthly trend chart
6. add better empty states
7. add loading states and skeletons
8. review responsiveness and visual polish
9. update stale UI copy
10. run `lint` and `build`

---

## Definition of Ready

Sprint 5 will be ready when the `/reports` route stops being a placeholder and becomes a real analytical product view, complementing the dashboard with monthly trend, more report-oriented breakdowns, and a more polished overall app experience.

# Sprint 3 Status

## Overview

Sprint 3 focused on turning the entries module into the first truly usable day-to-day flow in the app.

The backend foundation for `entries` had already existed since Sprint 2, with schema, validations, queries, and server actions ready. In this sprint, the main work was connecting that foundation to a functional, mobile-first interface that matches the product's visual direction.

At the end of what has been implemented so far, the user can already create, view, filter, edit, and delete entries through the interface.

---

## Sprint 3 Goal

Implement the functional core of financial entries in the app, enabling:

- income creation
- expense creation
- real database-backed entry listing
- editing existing entries
- deleting entries
- filtering by month
- filtering by type
- filtering by category
- searching by description

The practical goal of this sprint was to take the `entries` module out of placeholder state and put the app into a real basic-use state for recording financial activity.

---

## Existing Base Before the Implementation

Before this phase, the project already had:

- Supabase authentication
- server-side protection for private routes
- database schema with `entries`
- Zod validations for entries
- real entry queries
- server actions for create, update, and delete
- category validation compatible with the entry type
- active RLS and policies in the database

In other words, the functional backend infrastructure for entries was already ready. What was missing was the interface layer and the end-to-end integration in the app.

---

## What Was Implemented

## 1. Real entries page at `/entries`

The `/entries` route, which had been only a visual placeholder, became a real activity history screen.

Implemented:

- page header
- `New entry` button
- query-string-based filter reading
- integration with `listEntries(...)`
- loading of visible categories
- visual feedback for success and error
- empty state with no entries
- filtered empty state

The screen now uses real database data and became the main entry-history view.

---

## 2. Functional entry filters

The entries filter structure was created with support for:

- month
- type
- category
- description search

The filters use query string, enabling URLs like:

- `?month=2026-04`
- `?type=expense`
- `?categoryId=...`
- `?query=market`

Month-to-date-range conversion was also implemented:

- start of the month
- last day of the month

That allows the listing to query the database correctly using `start` and `end`, without changing the existing query API.

---

## 3. Reusable `entries` components

The base components of the module were created:

### `entry-form.tsx`

Responsible for:

- creating and editing entries
- switching type between `income` and `expense`
- displaying categories compatible with the selected type
- receiving amount, description, date, and notes
- validating amount and category before submit
- reusing the same structure for create and edit

### `entry-filters.tsx`

Responsible for:

- rendering the listing filters
- keeping the filter interface simple
- limiting categories according to type when applicable

### `entry-list.tsx`

Responsible for:

- receiving the ready list of entries
- rendering the empty state
- delegating item rendering to `entry-card.tsx`

### `entry-card.tsx`

Responsible for:

- displaying each entry in a compact way
- showing description, category, date, and amount
- visually differentiating income and expense
- enabling navigation to the edit screen

These components organize the module and leave Sprint 3 ready for future visual refinements without rewriting the base.

---

## 4. Creation screen at `/entries/new`

A dedicated route for entry creation was created.

This screen now:

- loads the user's visible categories
- uses `entry-form.tsx`
- calls the `createEntry` action
- redirects back to `/entries`
- shows an error message when needed
- shows success after creation

That made the main income and expense capture flow exist end to end.

---

## 5. Edit screen at `/entries/[id]/edit`

A route for editing existing entries was created.

This screen now:

- loads the entry by ID
- prefills the form with the current data
- reuses `entry-form.tsx`
- calls the `updateEntry` action
- redirects to the list after save
- shows an error message when needed

A dedicated deletion area was also added to this screen.

---

## 6. Deletion on the edit screen

Deletion was implemented only on `/entries/[id]/edit`, according to the sprint decision.

The flow works like this:

- open the entry
- view a separate delete block
- execute `deleteEntry`
- redirect to `/entries`
- show success feedback

This kept the list cleaner and avoided too many destructive actions directly on the main screen.

---

## 7. User-friendly monetary field

An important Sprint 3 decision was to adopt a user-friendly monetary value field.

Implemented:

- input designed for BRL-style amounts
- friendly formatting while typing
- conversion to `amountCents` before submission
- correct value prefilling when editing an entry

Logic example:

- user-friendly input: `12,50`
- persisted value: `1250`

That made the UI more natural for the end user without giving up the correct database modeling in integer cents.

---

## 8. Currency and date utilities

To avoid duplicate logic, utilities were created in `lib/utils` for:

- formatting currency values
- converting user-friendly input to cents
- prefilling the edit input from `amountCents`
- calculating the selected month date range
- formatting dates in the list

This centralizes important presentation rules for Sprint 3 and reduces inconsistency risk.

---

## 9. Local database connection adjustment

During implementation, a local runtime problem appeared when accessing real entry queries.

Identified cause:

- `DATABASE_URL` used the direct Supabase connection
- in the local environment, the host resolved to IPv6
- this generated an `ENETUNREACH` network error

To solve this, the following variable was introduced:

- `DATABASE_LOCAL_URL`

Applied rule:

- in local development, the app prioritizes `DATABASE_LOCAL_URL`
- in production, it still uses `DATABASE_URL`
- migrations remain separate on `DATABASE_MIGRATE_URL`

In practice, `DATABASE_LOCAL_URL` may use the same pooler value as `DATABASE_MIGRATE_URL`, but with a different semantic role: local runtime, not migration.

This adjustment stabilized database access during development.

---

## 10. `NEXT_REDIRECT` error fix

After implementing create/update/delete, a behavior appeared where:

- the action worked
- the redirect happened
- but a red error notification with `NEXT_REDIRECT` also appeared

Cause:

- `redirect()` was inside `try/catch` blocks
- Next internally uses `redirect()` as a special exception
- that exception was being caught as if it were a business error

Applied fix:

- success `redirect()` was moved outside the `try/catch`
- the `catch` remained responsible only for error redirection

This fix was applied to the `entries` flow and also to the `categories` screen, to keep consistency across the app.

---

## Files Created in Sprint 3

### Components

- `app/src/components/entries/entry-form.tsx`
- `app/src/components/entries/entry-filters.tsx`
- `app/src/components/entries/entry-list.tsx`
- `app/src/components/entries/entry-card.tsx`

### Routes

- `app/src/app/(app)/entries/new/page.tsx`
- `app/src/app/(app)/entries/[id]/edit/page.tsx`

### Utilities

- `app/src/lib/utils/currency.ts`
- `app/src/lib/utils/date.ts`

---

## Files Changed in Sprint 3

- `app/src/app/(app)/entries/page.tsx`
- `app/src/app/(app)/categories/page.tsx`
- `app/src/lib/db/client.ts`
- `app/.env.example`

There was also a local `.env` adjustment to include:

- `DATABASE_LOCAL_URL`

---

## Flows Already Working

With what has been delivered so far, the user can already:

1. open the entries screen
2. see real database-backed entries
3. filter by month
4. filter by type
5. filter by category
6. search by description
7. create an income entry
8. create an expense entry
9. edit an entry
10. delete an entry from the edit screen

This set already covers the main flow of Sprint 3.

---

## Validations and Guarantees Preserved

The interface was implemented while respecting the business rules that already existed in the backend:

- `amount_cents` must be positive
- description is required
- category must exist
- category must be visible to the user
- category must not be archived
- category must have the same type as the entry
- the user can only manipulate their own data

In other words, Sprint 3 connected the UI without breaking the guarantees built in Sprint 2.

---

## Technical Verification

After the implementations and fixes, it was validated that:

- `npm run lint` passes
- `npm run build` passes

This confirms that the sprint is consistent from the point of view of typing, routes, and compilation.

---

## Current State of Sprint 3

At this point, Sprint 3 is in a strong functional state.

There is already:

- full entries CRUD through the interface
- main filters
- real database integration
- baseline mobile-first experience
- user-friendly money conversion
- visual success and error feedback

The `entries` module stopped being a placeholder and became a real part of the product.

---

## What Is Still Worth Refining Within Sprint 3

Even with the core implemented, some refinements are still possible:

- full manual testing with more real scenarios
- additional visual polish for empty states and messages
- possible mobile UX refinement on small screens
- updating old app copy that still mentions Sprint 1 or Sprint 2

These points do not block the main flow but can improve finish and consistency.

---

## Conclusion

Sprint 3 moved the project from the "infrastructure ready" phase into the "real functional use" phase in the most important module of the MVP: entries.

The app now allows practical recording and review of financial activity, using a real database, real rules, and an interface integrated with the rest of the application.

This prepares the ground for the next MVP steps, especially dashboard and reports backed by real data.

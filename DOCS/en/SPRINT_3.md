# Sprint 3 - Entries

## Goal

Implement the functional core of financial entries in the app, allowing users to create, list, edit, delete, and filter income and expense records with a good mobile-first experience.

By the end of Sprint 3, the product should allow real basic day-to-day use for capturing and reviewing financial activity.

---

## Expected Outcome

By the end of Sprint 3, the user should be able to:

1. create an income entry
2. create an expense entry
3. list existing entries
4. edit an entry
5. delete an entry
6. filter by month
7. filter by type
8. filter by category

The dashboard may still remain simple in this sprint. The focus here is to guarantee that the entry flow works end to end.

---

## Sprint 3 Scope

### Included

1. entries listing screen
2. entry creation form
3. entry editing form
4. entry deletion
5. filters by month, type, and category
6. integration with the existing server actions
7. real usage of `entries` queries
8. visual error validation
9. mobile-first experience

### Out of Sprint 3

1. advanced charts
2. final dashboard
3. full reports
4. recurrence
5. CSV import
6. attachments
7. budgets
8. installments

---

## Dependencies Already Ready

This sprint builds on what was already completed in Sprints 1 and 2:

- Supabase authentication
- server-side guard
- database schema created
- RLS and policies applied
- `profiles`, `categories`, and `entries` tables
- `entries` Zod validations
- base `entries` queries
- `entries` server actions
- global and custom categories working

---

## Functional Objectives

### 1. Create Entry

The user should be able to create an entry with:

- type: `income` or `expense`
- category
- amount
- description
- date
- optional notes

### 2. List Entries

The screen should show:

- type
- amount
- description
- category
- date
- clear visual distinction between income and expense

### 3. Edit Entry

The user should be able to edit:

- category
- type
- amount
- description
- date
- notes

### 4. Delete Entry

The user should be able to safely remove their own entries.

### 5. Filter Entries

Planned filters:

- month
- type
- category
- description search

---

## Expected UX Flow

### Main mobile flow

1. open app
2. go to `Entries`
3. tap `New entry`
4. choose `Income` or `Expense`
5. fill amount, category, and description
6. save
7. return to the updated list

### Edit flow

1. open the list
2. tap the entry
3. edit fields
4. save
5. return with visible updates

### Delete flow

1. open item
2. delete
3. visually confirm the removal

---

## Sprint 3 Screens

### `/entries`

Main listing screen.

It should contain:

- page header
- new entry button
- filters
- entry list
- empty states
- error or success messages

### `/entries/new`

Creation screen.

This may later become a modal or sheet, but in this sprint it can start as a dedicated page.

### `/entries/[id]/edit`

Edit screen.

It should reuse the same form as much as possible.

---

## Recommended Component Structure

### `entries` Components

Create or complete:

- `entry-form.tsx`
- `entry-list.tsx`
- `entry-filters.tsx`
- `entry-card.tsx`

### Responsibility of Each One

#### `entry-form.tsx`

Responsible for:

- building inputs
- showing validations
- choosing category
- choosing type
- saving

#### `entry-list.tsx`

Responsible for:

- receiving the ready list
- rendering simple grouping or a direct list
- handling empty state

#### `entry-filters.tsx`

Responsible for:

- month
- type
- category
- description search

#### `entry-card.tsx`

Responsible for showing each item with:

- description
- category
- date
- amount
- visual differentiation between income and expense

---

## Expected File Structure

```txt
src/
  app/
    (app)/
      entries/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx

  components/
    entries/
      entry-form.tsx
      entry-list.tsx
      entry-filters.tsx
      entry-card.tsx

  lib/
    db/
      queries/
        entries.ts
    validations/
      entry.ts

  actions/
    entries/
      create-entry.ts
      update-entry.ts
      delete-entry.ts
```

---

## Business Rules

These rules already exist in part in the backend and must be respected in the UI:

1. `amount_cents` must be positive
2. category must exist
3. category must be visible to the user
4. category must not be archived
5. category must have the same type as the entry
6. everything must belong to the authenticated user
7. description is required
8. notes are optional

---

## Implementation Strategy

### Step 1: Base UI for the entries page

Implement `/entries` with:

- title
- `New entry` button
- visual container consistent with the app shell

### Step 2: Filters

Add `entry-filters.tsx` with:

- month selector
- type selector
- category selector
- text search

At this stage, filters may use query string.

Parameter examples:

- `?month=2026-04`
- `?type=expense`
- `?categoryId=...`
- `?query=market`

### Step 3: Real list query

Use `listEntries(...)` to render the real list.

The `/entries` screen should:

1. read filters from the URL
2. convert month into `start/end`
3. call the query
4. render the results

### Step 4: Creation form

Implement `/entries/new` using `entry-form.tsx`.

The form should:

- accept type
- load visible categories
- receive amount
- description
- notes
- date

On submit:

- call `createEntry`
- redirect to `/entries`
- show feedback

### Step 5: Editing form

Implement `/entries/[id]/edit`.

The flow should:

- load entry by ID
- prefill the form
- allow updates
- call `updateEntry`

### Step 6: Deletion

Add a delete button in the list or on the edit screen.

On delete:

- call `deleteEntry`
- revalidate pages
- redirect or update the list

### Step 7: States and minimal polish

Add:

- empty state for list without entries
- filtered empty state
- error messages
- success messages
- invalid field feedback

---

## Important Technical Details

### 1. Amount Conversion

The UI will probably work with readable monetary values, but the database uses `amount_cents`.

So the sprint must choose a clear approach:

#### Recommended option

Receive a user-friendly text/number field in the form and convert it to cents in the server layer.

Example:

- `12,50` -> `1250`

If you want to simplify in this sprint:

- use a numeric input with two decimals
- convert before the action

### 2. Categories by Type

When the user chooses `income`, the categories list should show only `income` categories.

When the user chooses `expense`, the categories list should show only `expense` categories.

### 3. Safe Editing

When editing, the backend must continue guaranteeing that:

- the user only edits what belongs to them
- the category is valid
- the type remains consistent

### 4. Monthly Filters

The UI should convert a month like `2026-04` into:

- start: `2026-04-01`
- end: last day of the month

---

## Definition of Done Criteria

Sprint 3 should only be considered complete when:

1. the user can create income and expenses
2. the listing renders real data from the database
3. filters work by month, type, and category
4. editing works
5. deletion works
6. visual validations appear correctly
7. everything works on mobile without layout breakage
8. `lint` and `build` pass

---

## Recommended Manual Tests

### Creation

1. create a valid income entry
2. create a valid expense entry
3. try to create with empty description
4. try to create with incompatible category

### Listing

1. verify items appear ordered by date
2. verify visual difference between income and expense
3. verify empty state

### Filters

1. filter by month
2. filter by type
3. filter by category
4. search by text

### Editing

1. edit description
2. edit amount
3. change category
4. change type with a compatible category

### Deletion

1. delete an entry
2. confirm it disappeared from the list

### Mobile

1. use a small screen
2. validate spacing
3. validate inputs
4. validate the main button

---

## Sprint 3 Risks

1. the form becomes too bureaucratic
2. monetary conversion creates inconsistencies
3. filters become confusing
4. desktop UI works better than mobile
5. logic is duplicated between create and edit

---

## Mitigations

1. use a single `entry-form.tsx`
2. centralize monetary conversion
3. keep filters minimal and clear
4. test mobile first
5. reuse the existing actions

---

## Recommended Execution Order

1. create `entry-filters.tsx`
2. implement `/entries` with the real query
3. create `entry-list.tsx`
4. create `entry-card.tsx`
5. create `entry-form.tsx`
6. implement `/entries/new`
7. implement `/entries/[id]/edit`
8. add deletion
9. review mobile UX
10. run `lint` and `build`

---

## Done Definition

Sprint 3 will be done when the app moves from the state of "infrastructure ready" to the state of "I can already record and review my real financial activity".

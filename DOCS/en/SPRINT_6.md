# Sprint 6 - MVP Finalization

## Goal

Finalize the `app_financas` MVP with a focus on installable mobile experience, visual polish, accessibility, perceived performance, and deployment readiness.

By the end of Sprint 6, the product should be ready to be considered a functional and presentable MVP, with the main modules implemented and a final layer of technical and visual refinement in place.

---

## Expected Result

By the end of Sprint 6, the user should be able to:

1. install the app as a PWA on mobile
2. see correct icons and identity when installing the app
3. use the application with more refined microinteractions
4. navigate with visible focus and better accessibility on the main screens
5. perceive a smoother experience on the main routes
6. use a product that is ready for final deployment

---

## Sprint 6 Scope

### Included

1. final PWA refinement
2. final app manifest
3. app icons for installation
4. final mobile metadata
5. microinteraction refinement
6. accessibility review
7. perceived performance review
8. final deployment checklist
9. final sprint documentation update

### Out of Sprint 6

1. `service worker`
2. robust offline support
3. offline synchronization
4. new functional module
5. complete `/settings`
6. export
7. large architectural refactors

---

## Closed PWA Decision

In this sprint, the project will follow:

- installable PWA with manifest and icons
- without robust offline support
- without `service worker`

Reason:

- lower technical risk
- lower maintenance cost
- delivery more focused on real MVP finishing
- sufficient for the current product proposal

In other words, the goal of this sprint is not to turn the app into an offline-first product, but to correctly finish the installable experience and the final polish of the application.

---

## Existing Base Before Implementation

Before this sprint, the project already has:

- Supabase authentication
- functional `entries`
- functional `dashboard`
- functional `reports`
- responsive private layout
- base `manifest.ts`
- `favicon.ico`
- loading states in the main private routes

In other words, the functional MVP already exists. What is missing now is polishing the final delivery and consolidating the product experience.

---

## Functional Goals

### 1. Installable PWA

The app must be correctly configured for installation on mobile.

This includes:

- consistent manifest
- correct name and description
- correct `start_url`
- proper `display`
- `theme_color` and `background_color`
- installation icons
- `apple-touch-icon` support

### 2. Final app metadata

Review the main project metadata to improve:

- app identity
- behavior on mobile browsers
- visual consistency when installing and opening

### 3. Microinteractions

Refine microinteractions on the main screens to improve the feeling of a finished product.

Apply mainly to:

- buttons
- clickable cards
- filters
- hover states
- focus states
- active states
- subtle transitions between blocks

### 4. Accessibility

Review the core app screens to improve:

- contrast
- visible focus
- basic semantics
- keyboard navigation
- clarity of labels and headings
- form usability

### 5. Perceived performance

Review points that may hurt app fluidity, focusing on:

- route navigation
- excessive visual cost
- mobile behavior
- chart weight in `reports`
- unnecessary client rendering

### 6. Deployment preparation

Finish the sprint with a reviewed deployment checklist, ensuring:

- clear environment variables
- consistent auth integration
- database working as expected
- structure ready for `Vercel + Supabase`

---

## Expected UX Flow

### Installation flow

1. open the app on mobile
2. install the app to the home screen
3. open the app as a standalone experience
4. perceive a consistent visual identity

### Daily usage flow

1. open the installed app
2. navigate quickly between dashboard, entries, categories, and reports
3. perceive clear visual feedback in interactions
4. use the product with a finish closer to a real app

---

## Priority Areas of Sprint 6

### 1. PWA

Review:

- `manifest.ts`
- root layout metadata
- app icons
- installation configuration

### 2. Accessibility

Review priority:

1. `entries`
2. `dashboard`
3. `reports`
4. `categories`
5. landing

### 3. Performance

Focus on:

- perceived fluidity
- no visual regression
- no excessive refactor

### 4. Deployment

Focus on:

- environment consistency
- authentication
- database
- final publication

---

## Recommended File Structure

```txt
src/
  app/
    manifest.ts
    layout.tsx
    icon.png
    apple-icon.png
    favicon.ico

  components/
    ...

  lib/
    ...

public/
  ... (if icons are placed here)
```

---

## Implementation Strategy

### Step 1: manifest and metadata

Review and complete:

- `manifest.ts`
- `layout.tsx` metadata

### Step 2: app icons

Add the required icons for installable PWA behavior.

### Step 3: installation validation

Check whether the installed experience opens coherently and with the correct visual identity.

### Step 4: microinteractions

Apply subtle refinements to the main interactions.

### Step 5: accessibility

Do a pragmatic review on the core screens, fixing clear issues around focus, semantics, contrast, and labels.

### Step 6: performance

Do a pragmatic review of perceived fluidity and remove unnecessary visual-cost points.

### Step 7: deployment checklist

Consolidate what needs to be correct to publish the app in production.

### Step 8: final verification

Run:

- `npm run lint`
- `npm run build`

---

## Important Technical Details

### 1. No `service worker`

This sprint must not introduce a `service worker`.

Reason:

- avoids extra complexity
- avoids cache that is difficult to debug
- keeps the final sprint focused on what adds the most value right now

### 2. Controlled PWA scope

The goal is to deliver:

- installation
- visual identity
- good standalone experience

It is not a goal to deliver:

- offline-first
- local synchronization
- sophisticated cache

### 3. Pragmatic accessibility

The accessibility review should focus on what creates immediate real gains:

- focus
- contrast
- labels
- keyboard navigation
- main semantics

### 4. Performance without large refactor

The sprint should prioritize small and safe adjustments instead of opening major structural changes near the final delivery.

---

## Business Rules

1. the app continues to show only data from the authenticated user
2. finalizing the PWA must not change the functional logic of the already completed modules
3. the sprint must not introduce offline behavior that changes persistence rules
4. accessibility and performance must be improved without functional regression

---

## Definition of Done Criteria

Sprint 6 should only be considered complete when:

1. the app is correctly configured as an installable PWA
2. the manifest is finalized
3. the app icons are configured
4. the mobile metadata is reviewed
5. the main microinteractions are refined
6. accessibility of the core screens has been reviewed
7. perceived performance has been reviewed without evident regression
8. the final deployment checklist is consolidated
9. `lint` and `build` pass
10. the sprint documentation is updated

---

## Recommended Manual Tests

### PWA

1. open the app on mobile
2. install it to the home screen
3. open it as a standalone app
4. validate icon, name, and color

### Accessibility

1. navigate by keyboard on the main screens
2. validate visible focus
3. validate forms and labels
4. validate contrast in dark mode

### Performance

1. navigate between `dashboard`, `entries`, `categories`, and `reports`
2. validate fluidity on mobile
3. validate the behavior of the `reports` chart

### Deployment

1. review environment variables
2. validate login
3. validate auth callback
4. validate database access

---

## Sprint 6 Risks

1. trying to add robust offline support too late
2. overdoing animation and losing clarity
3. opening large refactors near MVP closure
4. changing performance without focus and introducing regression

---

## Mitigations

1. keep PWA with controlled scope
2. use subtle microinteractions
3. prioritize small and safe changes
4. always validate with `lint`, `build`, and objective manual tests

---

## Recommended Execution Order

1. review `manifest.ts`
2. review metadata in `layout.tsx`
3. add app icons
4. validate PWA installation
5. review accessibility of the main screens
6. apply microinteraction refinements
7. review perceived performance
8. consolidate deployment checklist
9. run `lint` and `build`
10. update final documentation

---

## Definition of Ready

Sprint 6 will be ready when `app_financas` stops being only a functional MVP and becomes a finalized MVP for delivery, with installable mobile experience, consistent finish, reviewed accessibility, validated performance, and deployment prepared.

# Component Migration Plan: AppRun

---

> **⚠️ COMPONENT-LEVEL PLANNING - NO EXECUTION**
> 
> This document provides detailed analysis and transformation mapping for a single component.
> - ✅ Analyzes component structure and dependencies
> - ✅ Maps AngularJS patterns to Angular equivalents
> - ✅ Documents what needs to transform
> - ❌ Does NOT provide implementation code
> - ❌ Does NOT execute the migration
> 
> **Handoff:** This plan is used by executor agents/developers to implement the migration.

---

```yaml
# YAML Frontmatter - Machine-readable metadata
component_name: "AppRun"
component_type: "run"
source_file: "src/js/config/app.run.js"
target_file: "src/app/core/app.initializer.ts"
migration_status: "PENDING"
dependency_level: 1
blocking_dependencies: ["AppConstants"]
created_date: "2025-10-24"
updated_date: "2025-10-24"
```

---

## 1. Component Overview

### Basic Information
- **Name:** AppRun
- **Type:** Run (Application Initializer)
- **Source:** `src/js/config/app.run.js`
- **Target:** `src/app/core/app.initializer.ts`
- **Lines of Code:** 21 lines
- **Transformation Points:** 4 (ngInject, $rootScope usage, $stateChangeSuccess event, AppConstants injection)

### Purpose
This component initializes the application, sets up a global page title management system, and listens for state changes to update the page title accordingly.

### Business Context
Maintaining consistent and accurate page titles is important for user experience and SEO. This component ensures that page titles are updated correctly as the user navigates through the application.

---

## 2. Current State Analysis

### Module Registration
The current file exports a function `AppRun` which is likely registered as a run block in the AngularJS application.

### Injected Dependencies
```javascript
function AppRun(AppConstants, $rootScope) {
  'ngInject';
  // ...
}
```

### AngularJS Patterns Used

| Pattern | Count | Lines | Transformation Notes |
|---------|-------|-------|---------------------|
| `'ngInject'` | 1 | 2 | Remove, use TypeScript for DI |
| `$rootScope` usage | 3 | 5-6, 10-16 | Replace with a service or component |
| `$stateChangeSuccess` event | 1 | 5-7 | Replace with Angular Router events |
| AppConstants injection | 1 | 1, 16 | Update import and usage |

**Total Transformation Points:** 4

### Code Structure Overview

**Properties:**
- Total properties: 1 (`pageTitle` on `$rootScope`)
- Public properties: 1
- Internal state: 0

**Methods:**
- Total methods: 1 (`setPageTitle`)
- Public methods: 1
- Private/helper methods: 0

---

## 3. Dependency Analysis

### Incoming Dependencies (Who Uses This)
This is likely used as a run block in the main application module. It doesn't have direct consumers but affects the entire application.

**Consumer Count:** N/A (global effect)

### Outgoing Dependencies (What This Needs)

| Dependency | Type | Status | Migration Blocker | Notes |
|-----------|------|--------|------------------|-------|
| AppConstants | Constant | COMPLETED | No | Available |
| $rootScope | AngularJS Service | N/A | No | Will be replaced |

**Blocking Dependencies:** None

### Third-Party Dependencies
None.

---

## 4. Transformation Mapping

### Pattern Transformations

| AngularJS Pattern | Angular Equivalent | Transformation Approach |
|-------------------|-------------------|------------------------|
| Run block | APP_INITIALIZER | Use Angular's APP_INITIALIZER token |
| `$rootScope` | Service + Router | Create a TitleService and use Angular Router |
| `$stateChangeSuccess` | Router events | Subscribe to Router's NavigationEnd event |
| `'ngInject'` | TypeScript | Remove, use TypeScript for dependency injection |

### File Structure Transformation

**Source (AngularJS):**
```
src/js/config/app.run.js (single file)
```

**Target (Angular):**
```
src/app/core/
├── services/
│   └── title.service.ts
└── app.initializer.ts
```

### Interface/Type Definitions Needed
```typescript
interface AppConstants {
  appName: string;
}
```

---

## 5. Transformation Requirements

### Properties & State
- **Total properties to migrate:** 1 (`pageTitle`)
- **Type definitions needed:** 1 (AppConstants interface)
- **State management approach:** TitleService to manage page title

### Methods
- **Total methods to migrate:** 1 (`setPageTitle`)
- **Event handler updates:** 1 (replace `$stateChangeSuccess` with Router event)

### Template
No template changes required (not a component with a template).

### Lifecycle Hooks Needed
- [ ] Constructor - for dependency injection
- [ ] ngOnDestroy - to unsubscribe from Router events

### Cleanup Requirements
- **Observable subscriptions:** 1 (Router events subscription)

---

## 6. Breaking Changes & Impact

### API Changes
The `$rootScope.setPageTitle` method will no longer be globally available. Components that used this method will need to be updated to use the new TitleService.

### Consumer Impact
**Components that need updates:**
- [ ] All components that directly set page titles
- [ ] Main app module (to include APP_INITIALIZER)

**Estimated Impact:** Medium - Global change but with a clear migration path

---

## 7. Testing Requirements

### Unit Testing
- **Test scope:** 2 test cases
- **Coverage target:** 100%
- **Critical paths to test:**
  - [ ] Page title is set correctly on navigation
  - [ ] AppConstants.appName is appended to the title

### Integration Testing
- [ ] Verify page title updates correctly during navigation
- [ ] Ensure AppConstants integration works as expected

### Visual/E2E Testing
- [ ] Verify correct page titles appear in the browser during E2E tests

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| Missing title updates | MEDIUM | MEDIUM | Comprehensive E2E tests |
| Performance impact | LOW | LOW | Optimize Router event handling |
| Breaking existing components | MEDIUM | HIGH | Clear documentation and migration guide for title updates |

**Overall Risk Level:** MEDIUM

---

## 9. Definition of Done

### Code Quality
- [ ] TypeScript compiles with strict mode
- [ ] No `any` types used
- [ ] ESLint passes with no warnings
- [ ] Code review approved

### Functionality
- [ ] Page titles update correctly on navigation
- [ ] AppConstants integration works as expected
- [ ] No runtime errors related to title updates

### Testing
- [ ] Unit tests pass (100% coverage)
- [ ] Integration tests for navigation and title updates pass
- [ ] E2E tests verify correct page titles

### Documentation
- [ ] TitleService usage documented
- [ ] Migration notes for components using old `setPageTitle` method
- [ ] APP_INITIALIZER setup documented

### Integration
- [ ] No AngularJS dependencies remain
- [ ] Router integration complete
- [ ] AppConstants correctly imported and used

---

## 10. Executor Notes

### Recommended Migration Approach
1. Create a new TitleService to manage page titles.
2. Implement APP_INITIALIZER to set up Router event subscription.
3. Update AppModule to include APP_INITIALIZER and TitleService.
4. Create a migration guide for updating components that used `$rootScope.setPageTitle`.
5. Update E2E tests to verify correct page title behavior.

### Key Challenges
- Ensuring all components switch to the new TitleService
- Handling edge cases in title formatting that may have relied on $rootScope

### Helpful Resources
- [Angular - APP_INITIALIZER](https://angular.io/api/core/APP_INITIALIZER)
- [Angular Router Events](https://angular.io/guide/router#router-events)
- [Angular Services](https://angular.io/guide/architecture-services)

---

## 11. Status Tracking

### Progress Checklist
- [x] Analysis complete
- [ ] Dependencies resolved
- [ ] Transformation planned
- [ ] Implementation started
- [ ] Testing completed
- [ ] Code review passed
- [ ] Merged to branch
- [ ] Validated in integration

### Current Status
**Status:** 🔴 PENDING

**Blocker (if any):** None

**Last Updated:** 2025-10-24

---

## 12. Notes & Lessons Learned

- The transition from `$rootScope` to a service-based approach improves encapsulation and testability.
- Consider using NgRx or another state management solution if the application grows more complex.

---

## 13. Revision History

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-10-24 | 1.0 | Initial analysis | Planner Agent |

---

**END OF COMPONENT MIGRATION PLAN**
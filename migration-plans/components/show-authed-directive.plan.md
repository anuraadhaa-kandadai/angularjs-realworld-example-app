# Component Migration Plan: Show Authed Directive

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
component_name: "ShowAuthed"
component_type: "directive"
source_file: "src/js/components/show-authed.directive.js"
target_file: "src/app/shared/directives/show-authed.directive.ts"
migration_status: "PENDING"
dependency_level: 1
blocking_dependencies: ["User"]
created_date: "2025-10-24"
updated_date: "2025-10-24"
```

---

## 1. Component Overview

### Basic Information
- **Name:** ShowAuthed
- **Type:** Directive
- **Source:** `src/js/components/show-authed.directive.js`
- **Target:** `src/app/shared/directives/show-authed.directive.ts`
- **Lines of Code:** 32 lines
- **Transformation Points:** 5

### Purpose
This directive controls the visibility of elements based on the user's authentication status. It shows or hides elements depending on whether a user is logged in and the value of the `show-authed` attribute.

### Business Context
Authentication-based UI control is crucial for displaying appropriate content and controls to users based on their login status, enhancing user experience and application security.

---

## 2. Current State Analysis

### Module Registration
```javascript
export default ShowAuthed;
```

### Directive Definition
```javascript
function ShowAuthed(User) {
  'ngInject';

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // ... implementation
    }
  };
}
```

### AngularJS Patterns Used

| Pattern | Count | Lines | Transformation Notes |
|---------|-------|-------|---------------------|
| Directive definition | 1 | 1-30 | Convert to Angular @Directive |
| Dependency injection | 1 | 1-2 | Use constructor injection in Angular |
| $watch usage | 1 | 9-26 | Replace with OnChanges or observable |
| DOM manipulation | 4 | 13, 15, 21, 23 | Use Renderer2 for DOM manipulation |
| Attribute binding | 2 | 12, 20 | Use @Input() for attribute binding |

**Total Transformation Points:** 5

### Code Structure Overview

**Properties (Estimated):**
- Total properties: 1
- Public properties: 0
- Internal state: 1 (`User` service)

**Methods (Estimated):**
- Total methods: 1 (link function)
- Public methods: 0
- Private/helper methods: 1 (link function logic)

---

## 3. Dependency Analysis

### Incoming Dependencies (Who Uses This)

| Consumer Component | Type | File | Impact If Changed |
|-------------------|------|------|-------------------|
| [Unknown] | [Unknown] | [Unknown] | MEDIUM - Used for auth-based UI control |

**Consumer Count:** Unknown (need to analyze templates using this directive)

### Outgoing Dependencies (What This Needs)

| Dependency | Type | Status | Migration Blocker | Notes |
|-----------|------|--------|------------------|-------|
| User | Service | PENDING | ✅ Yes | Must migrate User service first |

**Blocking Dependencies:** User service

### Third-Party Dependencies

| Library | Used For | Angular Equivalent | Action |
|---------|----------|-------------------|--------|
| N/A | N/A | N/A | N/A |

---

## 4. Transformation Mapping

### Pattern Transformations

| AngularJS Pattern | Angular Equivalent | Transformation Approach |
|-------------------|-------------------|------------------------|
| Directive definition | @Directive decorator | Use @Directive with selector |
| Dependency injection | Constructor injection | Inject dependencies in constructor |
| $watch usage | ngOnChanges or observable | Use ngOnChanges or subscribe to User service |
| DOM manipulation | Renderer2 | Use Renderer2 for DOM manipulation |
| Attribute binding | @Input() decorator | Use @Input() for attribute binding |

### File Structure Transformation

**Source (AngularJS):**
```
src/js/components/show-authed.directive.js
```

**Target (Angular):**
```
src/app/shared/directives/show-authed.directive.ts
```

### Interface/Type Definitions Needed

| Data Structure | Current Type | Angular Type | Notes |
|---------------|-------------|-------------|-------|
| User | Service | UserService | Import from user service file |

---

## 5. Transformation Requirements

### Properties & State
- **Total properties to migrate:** 1
- **Type definitions needed:** 1 (User service)
- **State management approach:** Inject UserService

### Methods
- **Total methods to migrate:** 1 (link function logic)
- **Promise → Observable conversions:** 0
- **Event handler updates:** 0

### Template
- **Template syntax updates:** N/A (Directive doesn't have a template)
- **Event binding updates:** N/A
- **Structural directives:** N/A

### Lifecycle Hooks Needed
- [ ] ngOnInit - For initialization logic
- [ ] ngOnChanges - To react to input changes
- [ ] ngOnDestroy - To unsubscribe from observables

### Cleanup Requirements
- **Observable subscriptions:** Implement in ngOnDestroy
- **Event listeners:** N/A
- **Timers/Intervals:** N/A

---

## 6. Breaking Changes & Impact

### API Changes

**Interface Changes:**
| Before | After | Breaking? |
|--------|-------|-----------|
| `show-authed` attribute | `[showAuthed]` input | ✅ Yes - Syntax change |

### Consumer Impact
**Components that need updates:**
- [ ] All templates using `show-authed` directive - Must update syntax

**Estimated Impact:** MEDIUM (Affects all places where auth-based UI control is used)

---

## 7. Testing Requirements

### Unit Testing
- **Test scope:** 2 test cases estimated
- **Coverage target:** ≥80%
- **Critical paths to test:**
  - [ ] Directive shows element when user is authenticated and `showAuthed` is true
  - [ ] Directive hides element when user is authenticated and `showAuthed` is false
  - [ ] Directive shows element when user is not authenticated and `showAuthed` is false
  - [ ] Directive hides element when user is not authenticated and `showAuthed` is true

### Integration Testing
- [ ] Directive works correctly with UserService
- [ ] Directive responds to changes in authentication status

### Visual/E2E Testing
- [ ] Elements are correctly shown/hidden based on auth status in various scenarios

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| Breaking existing UI flows | HIGH | MEDIUM | Comprehensive testing, staged rollout |
| Performance issues with new implementation | LOW | LOW | Use efficient change detection strategy |
| Inconsistent behavior across browsers | LOW | MEDIUM | Cross-browser testing |

**Overall Risk Level:** MEDIUM

---

## 9. Definition of Done

### Code Quality
- [ ] TypeScript compiles with strict mode
- [ ] No `any` types used
- [ ] ESLint passes with no warnings
- [ ] Code review approved

### Functionality
- [ ] Directive correctly shows/hides elements based on auth status
- [ ] Directive responds to changes in auth status
- [ ] Performance is equivalent or better than AngularJS version

### Testing
- [ ] Unit tests pass (≥80% coverage)
- [ ] Integration tests pass
- [ ] E2E tests for auth-based UI control pass

### Documentation
- [ ] Code comments added
- [ ] Directive usage documentation updated
- [ ] Migration notes documented for consumers

### Integration
- [ ] No AngularJS dependencies remain
- [ ] All imports use Angular patterns
- [ ] Consumers updated to use new directive syntax

---

## 10. Executor Notes

### Recommended Migration Approach
1. Create new Angular directive file
2. Implement @Directive decorator with appropriate selector
3. Inject UserService in constructor
4. Implement ngOnInit to subscribe to user authentication status
5. Use @Input() for showAuthed attribute
6. Use Renderer2 for DOM manipulation
7. Implement ngOnDestroy for cleanup
8. Write unit tests
9. Update all consumers to use new directive syntax

### Key Challenges
- Ensuring the directive responds correctly to real-time changes in auth status
- Maintaining performance while checking for auth status changes
- Updating all instances of the directive usage across the application

### Helpful Resources
- [Angular Attribute Directives Guide](https://angular.io/guide/attribute-directives)
- [Renderer2 Documentation](https://angular.io/api/core/Renderer2)
- [RxJS Observable Guide](https://rxjs.dev/guide/observable)

---

## 11. Status Tracking

### Progress Checklist
- [x] Analysis complete
- [ ] Dependencies resolved
- [x] Transformation planned
- [ ] Implementation started
- [ ] Testing completed
- [ ] Code review passed
- [ ] Merged to branch
- [ ] Validated in integration

### Current Status
**Status:** 🟡 IN_PROGRESS

**Blocker (if any):** User service migration

**Last Updated:** 2025-10-24

---

## 12. Notes & Lessons Learned

- Consider using `*ngIf` with an inverted condition instead of show/hide for better performance in some cases
- Evaluate if a structural directive might be more appropriate for this use case in Angular

---

## 13. Revision History

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-10-24 | 1.0 | Initial analysis | Planner Agent |

---

**END OF COMPONENT MIGRATION PLAN**
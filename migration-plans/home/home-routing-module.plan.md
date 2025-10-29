# Component Migration Plan: Home Routing Module

---

> **⚠️ COMPONENT-LEVEL PLANNING - NO EXECUTION**
> 
> This document provides detailed analysis and transformation mapping for the Home routing module.
> - ✅ Analyzes component structure and dependencies
> - ✅ Maps AngularJS patterns to Angular equivalents
> - ✅ Documents what needs to transform
> - ❌ Does NOT provide implementation code
> - ❌ Does NOT execute the migration
> 
> **Handoff:** This plan is used by executor agents/developers to implement the migration.

---

```yaml
component_name: "HomeRoutingModule"
component_type: "routing"
source_file: "src/js/home/home.config.js"
target_file: "src/app/features/home/home-routing.module.ts"
migration_status: "PENDING"
dependency_level: 4
blocking_dependencies: ["HomeComponent"]
created_date: "2025-10-27"
updated_date: "2025-10-27"
```

---

## 1. Component Overview

### Basic Information
- **Name:** HomeRoutingModule
- **Type:** Routing Configuration
- **Source:** `src/js/home/home.config.js`
- **Target:** `src/app/features/home/home-routing.module.ts`
- **Lines of Code:** ~20 lines (estimated)
- **Transformation Points:** 3

### Purpose
This module defines the routing configuration for the Home feature, which is typically the landing page of the application. It sets up the route for the home page and any necessary resolvers or guards.

### Business Context
The Home routing is crucial as it's often the first page users see when they visit the application. It may include featured articles, tags, or other content that gives users an overview of the platform.

---

## 2. Current State Analysis

### Module Registration
```javascript
function HomeConfig($stateProvider) {
  'ngInject';
  $stateProvider
  .state('app.home', {
    url: '/',
    controller: 'HomeCtrl',
    controllerAs: '$ctrl',
    templateUrl: 'home/home.html',
    title: 'Home'
  });
}

export default HomeConfig;
```

### AngularJS Patterns Used

| Pattern | Count | Lines | Transformation Notes |
|---------|-------|-------|---------------------|
| UI-Router state definition | 1 | 4-10 | Convert to Angular Router configuration |
| Controller and ControllerAs syntax | 1 | 6-7 | Replace with component in route definition |
| Title setting | 1 | 9 | Handle with Angular route data or separate service |

**Total Transformation Points:** 3

---

## 3. Dependency Analysis

### Incoming Dependencies (Who Uses This)
- Main app module (for registering routes)

### Outgoing Dependencies (What This Needs)

| Dependency | Type | Status | Migration Blocker | Notes |
|-----------|------|--------|------------------|-------|
| HomeCtrl | Controller | PENDING | ✅ Yes | Must be migrated to HomeComponent |

**Blocking Dependencies:** HomeComponent (formerly HomeCtrl)

### Third-Party Dependencies

| Library | Used For | Angular Equivalent | Action |
|---------|----------|-------------------|--------|
| UI-Router | Routing | Angular Router | Replace |

---

## 4. Transformation Mapping

### Pattern Transformations

| AngularJS Pattern | Angular Equivalent | Transformation Approach |
|-------------------|-------------------|------------------------|
| `$stateProvider.state()` | `Routes` array | Define routes using Angular's `Route` interface |
| `controller` and `controllerAs` | Component | Reference the migrated HomeComponent in the route definition |
| `title` property | Route data | Add title to route data for use in a title service |

### File Structure Transformation

**Source (AngularJS):**
```
src/js/home/home.config.js
```

**Target (Angular):**
```
src/app/features/home/home-routing.module.ts
```

---

## 5. Transformation Requirements

### Routing Configuration
- Create a `HomeRoutingModule` class
- Define routes using Angular's `Routes` array
- Use `RouterModule.forChild()` to create the routing module

### Module Setup
- Import necessary Angular modules (`NgModule`, `RouterModule`)
- Import `HomeComponent`
- Set up `@NgModule` decorator with imports, declarations, and exports

### Title Handling
- Add title to route data
- Ensure a title service is set up in the core module to handle setting page titles

---

## 6. Breaking Changes & Impact

### API Changes

| Before | After | Breaking? |
|--------|-------|-----------|
| `$state.go('app.home')` | `router.navigate(['/'])` | ✅ Yes |

### Consumer Impact
- Update all navigation to home page to use Angular's `Router` service
- Ensure `HomeModule` is properly imported in the main `AppModule`

**Estimated Impact:** Low (simple route with minimal configuration)

---

## 7. Testing Requirements

### Unit Testing
- Test that the home route is correctly defined
- Verify that the correct component is associated with the route
- Ensure the route data includes the correct title

### Integration Testing
- Verify that navigating to the root URL ('/) loads the HomeComponent
- Test that the page title is set correctly when navigating to the home page

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| Broken navigation to home | LOW | HIGH | Thorough testing of root route |
| Incorrect title setting | LOW | LOW | Verify title service integration |

**Overall Risk Level:** LOW

---

## 9. Definition of Done

- [ ] `HomeRoutingModule` is created and configured correctly
- [ ] Home route is defined with correct path and component
- [ ] Title is included in route data
- [ ] `HomeModule` is set up to import `HomeRoutingModule`
- [ ] Unit tests for routing module pass
- [ ] Integration tests for home navigation pass
- [ ] No references to UI-Router or `$state` remain in the home feature

---

## 10. Executor Notes

### Recommended Migration Approach
1. Create the `home-routing.module.ts` file
2. Define the home route using Angular's `Routes` array
3. Set up the `HomeRoutingModule` with necessary imports and exports
4. Update `HomeModule` to import the new routing module
5. Ensure title handling is implemented (either in this module or via a separate service)

### Key Challenges
- Ensuring the home page is still the default landing page in the new routing setup
- Coordinating with the overall application routing to maintain the correct hierarchy

### Helpful Resources
- [Angular Routing & Navigation Guide](https://angular.io/guide/router)
- [Route data and resolve](https://angular.io/guide/router#route-data)

---

## 11. Status Tracking

### Progress Checklist
- [ ] Analysis complete
- [ ] Dependencies resolved
- [ ] Transformation planned
- [ ] Implementation started
- [ ] Testing completed
- [ ] Code review passed
- [ ] Merged to feature branch

### Current Status
**Status:** 🔴 PENDING

**Blocker (if any):** Waiting for HomeComponent migration

**Last Updated:** 2025-10-27

---

## 12. Notes & Lessons Learned

[To be filled in during and after migration]

---

## 13. Revision History

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-10-27 | 1.0 | Initial analysis and plan creation | Planner Agent |

---

**END OF COMPONENT MIGRATION PLAN**
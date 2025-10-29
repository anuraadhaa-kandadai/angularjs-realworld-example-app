# Component Migration Plan: Home

---

> **COMPONENT-LEVEL PLANNING - NO EXECUTION**
> 
> This document provides detailed analysis and transformation mapping for the Home component.
> - Analyzes component structure and dependencies
> - Maps AngularJS patterns to Angular equivalents
> - Documents what needs to transform
> - Does NOT provide implementation code
> - Does NOT execute the migration
> 
> **Handoff:** This plan is used by executor agents/developers to implement the migration.

---

```yaml
# YAML Frontmatter - Machine-readable metadata
component_name: "Home"
component_type: "controller"
source_files: 
  - "src/js/home/home.config.js"
  - "src/js/home/home.controller.js"
  - "src/js/home/home.html"
target_files:
  - "src/app/features/home/home.component.ts"
  - "src/app/features/home/home.component.html"
  - "src/app/features/home/home.component.scss"
  - "src/app/features/home/home.module.ts"
  - "src/app/features/home/home-routing.module.ts"
migration_status: "PENDING"
dependency_level: 2
blocking_dependencies: ["UserService", "ArticleListComponent", "TagsService"]
created_date: "2025-10-29"
updated_date: "2025-10-29"
```

---

## 1. Component Overview

### Basic Information
- **Name:** Home
- **Type:** Controller (to be migrated to Component)
- **Source:** 
  - `src/js/home/home.config.js`
  - `src/js/home/home.controller.js`
  - `src/js/home/home.html`
- **Target:** 
  - `src/app/features/home/home.component.ts`
  - `src/app/features/home/home.component.html`
  - `src/app/features/home/home.component.scss`
  - `src/app/features/home/home.module.ts`
  - `src/app/features/home/home-routing.module.ts`
- **Lines of Code:** ~100 lines (estimated, to be confirmed)

### Purpose
The Home component serves as the landing page for the application. It displays a feed of articles, popular tags, and allows users to toggle between different article feeds (Your Feed, Global Feed).

### Business Context
This component is critical as it's the first page users see when they visit the application. It showcases the latest content and provides quick access to personalized and global article feeds, driving user engagement.

---

## 2. Current State Analysis

### Module Registration
```javascript
angular.module('app.home', []).config(HomeConfig).controller('HomeCtrl', HomeCtrl);
```

### Injected Dependencies
```javascript
HomeCtrl.$inject = ['User', 'Tags', 'AppConstants', '$scope'];
```

### AngularJS Patterns Used

| Pattern | Count | Lines | Transformation Notes |
|---------|-------|-------|---------------------|
| `$scope` usage | 1 | 6 | Convert to class property |
| Service injection | 3 | 2 | Use dependency injection in constructor |
| Promise (.then) | 1 | 11-16 | Convert to Observable and use async pipe |
| `$scope.$broadcast` | 1 | 26 | Replace with a service or EventEmitter |
| `ng-bind` | 2 | 6, 61 | Use interpolation {{ }} |
| `show-authed` | 2 | 4, 21 | Create custom structural directive or use *ngIf with auth service |
| `ng-show` | 3 | 37, 57, 65 | Use *ngIf |
| `ng-class` | 2 | 23, 31 | Use [ngClass] |
| `ng-click` | 3 | 24, 32, 59 | Use (click) |
| `ng-repeat` | 1 | 60 | Use *ngFor |
| Custom component | 1 | 47 | Migrate article-list component and update input binding |

### Code Structure Overview

**Properties:**
- Total properties: 5
- Public properties: 4 (appName, tagsLoaded, tags, listConfig)
- Private properties: 1 (_$scope)

**Methods:**
- Total methods: 1
- Public methods: 1 (changeList)

---

## 3. Dependency Analysis

### Incoming Dependencies (Who Uses This)
| Consumer Component | Type | File | Impact If Changed |
|-------------------|------|------|-------------------|
| AppComponent | Component | [TBD] | HIGH - Main routing |

**Consumer Count:** 1 component depends on this (to be confirmed)

### Outgoing Dependencies (What This Needs)

| Dependency | Type | Status | Migration Blocker | Notes |
|-----------|------|--------|------------------|-------|
| User | Service | PENDING | Yes | Must migrate first |
| Tags | Service | PENDING | Yes | Must migrate first |
| AppConstants | Constant | PENDING | No | Can be replaced with environment variables |
| ArticleListComponent | Component | PENDING | Yes | Must migrate first |

**Blocking Dependencies:** User, Tags, ArticleListComponent

### Third-Party Dependencies

| Library | Used For | Angular Equivalent | Action |
|---------|----------|-------------------|--------|
| N/A | N/A | N/A | N/A |

---

## 4. Transformation Mapping

### Pattern Transformations

| AngularJS Pattern | Angular Equivalent | Transformation Approach |
|-------------------|-------------------|------------------------|
| `$scope.property` | `public property` | Convert to class property with type |
| `$scope.$watch('user')` | `ngOnChanges()` or RxJS | Use lifecycle hook or reactive pattern |
| `ng-click` | `(click)` | Update template syntax |
| `ng-show` | `*ngIf` | Update template syntax |
| `ng-repeat` | `*ngFor` | Update template syntax |
| `ng-class` | `[ngClass]` | Update template syntax |

### File Structure Transformation

**Source (AngularJS):**
```
src/js/home/
├── home.config.js
├── home.controller.js
└── home.html
```

**Target (Angular):**
```
src/app/features/home/
├── home.component.ts
├── home.component.html
├── home.component.scss
├── home.module.ts
└── home-routing.module.ts
```

### Interface/Type Definitions Needed

| Data Structure | Current Type | Angular Type | Notes |
|---------------|-------------|-------------|-------|
| `listConfig` | Object | `ListConfig` interface | Define interface for list configuration |
| `tags` | Array | `string[]` | Array of tag strings |

---

## 5. Transformation Requirements

### Properties & State
- **Total properties to migrate:** 5 (appName, _$scope, tagsLoaded, tags, listConfig)
- **Type definitions needed:** 2 (ListConfig, Tag)
- **State management approach:** Component state, consider using NgRx for global state

### Methods
- **Total methods to migrate:** 1
- **Promise → Observable conversions:** 1 (Tags.getAll())
- **Event handler updates:** 1 (changeList)
- **Constructor logic to move:** User authentication check for listConfig

### Template
- **Template syntax updates:**
  - Convert 2 `ng-bind` to interpolation {{ }}
  - Update 2 `show-authed` to custom structural directive or *ngIf with auth service
  - Convert 3 `ng-show` to *ngIf
  - Update 2 `ng-class` to [ngClass]
  - Convert 3 `ng-click` to (click)
  - Convert 1 `ng-repeat` to *ngFor
- **Event binding updates:** 3 (ng-click to (click))
- **Structural directives:** 6 to convert (show-authed, ng-show to *ngIf, ng-repeat to *ngFor)
- **Custom components:** Migrate and update input binding for article-list component

### Lifecycle Hooks Needed
- [ ] `ngOnInit` - Initialization logic, load tags
- [ ] `ngOnDestroy` - Cleanup and unsubscribe from observables (if needed)

### Cleanup Requirements
- **Observable subscriptions:** 1 (Tags.getAll(), use async pipe if possible)
- **Event listeners:** None identified
- **Timers/Intervals:** None identified

---

## 6. Breaking Changes & Impact

### API Changes

**Interface Changes:**
| Before | After | Breaking? |
|--------|-------|-----------|
| `$scope.listConfig` | `listConfig: ListConfig` | No - Internal change |
| `$scope.setListTo(type)` | `setListTo(type: string)` | No - Internal change |

### Consumer Impact
**Components that need updates:**
- [ ] AppComponent - May need to update routing configuration

**Estimated Impact:** 1 component needs minor modifications

---

## 7. Testing Requirements

### Unit Testing
- **Test scope:** 5-7 test cases estimated
- **Coverage target:** ≥80%
- **Critical paths to test:**
  - [ ] Initialization logic (loading tags and articles)
  - [ ] Changing list types (Your Feed, Global Feed, Tag-based Feed)
  - [ ] Tag selection
  - [ ] User authentication state changes
  - [ ] Error handling for service calls

### Integration Testing
- [ ] Component integrates with UserService and TagsService
- [ ] ArticleListComponent receives correct configuration
- [ ] Routing works correctly for home page

### Visual/E2E Testing
- [ ] Home page renders correctly with all elements
- [ ] Feed switching works as expected
- [ ] Tag selection updates the article list
- [ ] Pagination works correctly (if implemented)

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| State management complexity | MEDIUM | MEDIUM | Consider using NgRx for global state |
| Service dependencies not ready | HIGH | HIGH | Prioritize UserService and TagsService migration |
| Performance issues with large article lists | LOW | MEDIUM | Implement virtual scrolling if needed |
| Breaking changes in ArticleListComponent | MEDIUM | HIGH | Coordinate closely with ArticleList migration |

**Overall Risk Level:** MEDIUM

---

## 9. Definition of Done

### Code Quality
- [ ] TypeScript compiles with strict mode
- [ ] No `any` types used
- [ ] ESLint passes with no warnings
- [ ] Code review approved

### Functionality
- [ ] Feature parity with AngularJS version
- [ ] All feed types work (Your Feed, Global Feed, Tag-based)
- [ ] Tag list is populated and clickable
- [ ] Article list updates based on selected feed/tag
- [ ] User authentication state is respected

### Testing
- [ ] Unit tests pass (≥80% coverage)
- [ ] Integration tests pass
- [ ] E2E tests for critical user flows
- [ ] Manual testing completed
- [ ] No console errors

### Documentation
- [ ] Code comments added for complex logic
- [ ] Component documentation updated
- [ ] Migration notes documented (challenges, solutions)

### Integration
- [ ] No AngularJS dependencies remain
- [ ] All imports use Angular patterns
- [ ] Lazy loading configured in routing (if applicable)

---

## 10. Executor Notes

### Recommended Migration Approach
1. Create the basic component structure (home.component.ts)
2. Migrate the template (home.component.html), updating Angular syntax:
   a. Convert ng-bind, ng-show, ng-class, ng-click, and ng-repeat directives
   b. Create a custom structural directive for show-authed or use *ngIf with auth service
   c. Update the article-list component integration
3. Implement component logic, converting constructor logic to ngOnInit:
   a. Move User authentication check for listConfig to ngOnInit
   b. Initialize appName (consider using environment variables instead of AppConstants)
4. Update service injections (User, Tags) and remove AppConstants and $scope
5. Convert Tags.getAll() promise to Observable
6. Implement changeList method using Angular's EventEmitter or a shared service to replace $scope.$broadcast
7. Create a separate routing module (home-routing.module.ts)
8. Consider state management solution for user authentication status and listConfig

### Key Challenges
- Coordinating with dependent services (User, Tags) migrations
- Handling the AppConstants.appName in Angular (consider using environment variables)
- Creating a custom structural directive for show-authed or integrating with an auth service
- Ensuring the ArticleListComponent is properly migrated and integrated
- Managing the listConfig state and its updates across the component
- Replacing $scope.$broadcast with a more Angular-appropriate communication method

### Helpful Resources
- [Angular Component Documentation](https://angular.io/guide/component-overview)
- [RxJS in Angular](https://angular.io/guide/rx-library)
- [Angular Routing & Navigation](https://angular.io/guide/router)

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
**Status:** 🔴 PENDING

**Blocker:** Waiting for UserService, TagsService, and ArticleListComponent migrations

**Last Updated:** 2025-10-29

---

## 12. Notes & Lessons Learned

[To be filled during and after migration]

---

## 13. Revision History

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-10-29 | 1.0 | Initial analysis and plan | Planner Agent |

---

**END OF COMPONENT MIGRATION PLAN**
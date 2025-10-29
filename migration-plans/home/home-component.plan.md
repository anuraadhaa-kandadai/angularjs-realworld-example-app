# Component Migration Plan: Home Component

---

> **⚠️ COMPONENT-LEVEL PLANNING - NO EXECUTION**
> 
> This document provides detailed analysis and transformation mapping for the Home component.
> - ✅ Analyzes component structure and dependencies
> - ✅ Maps AngularJS patterns to Angular equivalents
> - ✅ Documents what needs to transform
> - ❌ Does NOT provide implementation code
> - ❌ Does NOT execute the migration
> 
> **Handoff:** This plan is used by executor agents/developers to implement the migration.

---

```yaml
component_name: "HomeComponent"
component_type: "component"
source_file: "src/js/home/home.controller.js"
target_file: "src/app/features/home/home.component.ts"
migration_status: "PENDING"
dependency_level: 4
blocking_dependencies: ["TagsService", "UserService", "ArticlesService"]
created_date: "2025-10-27"
updated_date: "2025-10-27"
```

---

## 1. Component Overview

### Basic Information
- **Name:** HomeComponent
- **Type:** Component
- **Source:** `src/js/home/home.controller.js`
- **Target:** `src/app/features/home/home.component.ts`
- **Lines of Code:** ~100 lines (estimated)
- **Transformation Points:** 8

### Purpose
This component manages the home page of the application. It typically displays a list of articles, popular tags, and handles user interactions such as changing tabs or selecting tags.

### Business Context
The Home component is critical as it's often the first page users see. It showcases the platform's content and functionality, directly impacting user engagement and retention.

---

## 2. Current State Analysis

### Controller Definition
```javascript
class HomeCtrl {
  constructor(User, Tags, AppConstants, $scope) {
    'ngInject';

    this._$scope = $scope;
    this.appName = AppConstants.appName;
    this._Tags = Tags;

    this.tags = [];
    this.tagsLoaded = false;

    this.listConfig = {
      type: User.current ? 'feed' : 'all'
    };

    this.changeList = (newList) => {
      this._$scope.$broadcast('setListTo', newList);
    };

    $scope.$on('setPageTo', (ev, pageNumber) => {
      this.listConfig.currentPage = pageNumber;
    });

    this.loadTags();
  }

  loadTags() {
    this._Tags
      .getAll()
      .then(
        (tags) => {
          this.tags = tags;
          this.tagsLoaded = true;
        }
      );
  }
}

export default HomeCtrl;
```

### Injected Dependencies
```javascript
HomeCtrl.$inject = ['User', 'Tags', 'AppConstants', '$scope'];
```

### AngularJS Patterns Used

| Pattern | Count | Lines | Transformation Notes |
|---------|-------|-------|---------------------|
| Constructor DI | 1 | 2-3 | Convert to Angular DI |
| Service usage (User, Tags) | 3 | 7, 13, 31-38 | Update to use Angular services |
| Constants usage | 1 | 6 | Replace with environment variables or config service |
| $scope usage | 2 | 5, 21-23 | Replace with component properties and Angular events |
| $broadcast/$on | 2 | 18, 21-23 | Replace with Angular's EventEmitter or a shared service |
| Promise-based API calls | 1 | 31-38 | Convert to Observable-based calls |
| Controller methods | 2 | 17-19, 30-39 | Convert to component methods |
| Lifecycle hooks | 1 | 26 | Use Angular's ngOnInit for initialization |

**Total Transformation Points:** 8

---

## 3. Dependency Analysis

### Incoming Dependencies (Who Uses This)
- Home routing module

### Outgoing Dependencies (What This Needs)

| Dependency | Type | Status | Migration Blocker | Notes |
|-----------|------|--------|------------------|-------|
| UserService | Service | COMPLETED | No | Assumed to be migrated in earlier phase |
| TagsService | Service | COMPLETED | No | Assumed to be migrated in earlier phase |
| AppConstants | Constants | COMPLETED | No | Assumed to be migrated to environment variables or config service |
| $scope | AngularJS Service | N/A | No | Will be replaced with component properties and Angular events |

**Blocking Dependencies:** None

### Third-Party Dependencies
None identified.

---

## 4. Transformation Mapping

### Pattern Transformations

| AngularJS Pattern | Angular Equivalent | Transformation Approach |
|-------------------|-------------------|------------------------|
| Controller class | Component class | Create an Angular @Component |
| Constructor DI | Constructor DI | Use Angular's DI system |
| Service usage | Inject services | Update to use Angular services |
| Constants usage | Environment variables | Use Angular's environment files or config service |
| $scope usage | Component properties | Move $scope properties to component class properties |
| $broadcast/$on | EventEmitter | Use @Output() for child-to-parent communication |
| Promise-based calls | Observable-based calls | Use RxJS Observables with services |
| Controller methods | Component methods | Convert to component class methods |
| Lifecycle hooks | Angular lifecycle hooks | Implement OnInit interface |

### File Structure Transformation

**Source (AngularJS):**
```
src/js/home/home.controller.js
src/js/home/home.html
```

**Target (Angular):**
```
src/app/features/home/
├── home.component.ts
├── home.component.html
└── home.component.scss
```

---

## 5. Transformation Requirements

### Component Class
- Create `HomeComponent` class with `@Component` decorator
- Implement `OnInit` interface
- Convert constructor dependencies to Angular DI (UserService, TagsService, ConfigService)

### Properties
- Convert `appName`, `tags`, `tagsLoaded`, and `listConfig` to component properties
- Replace `$scope` properties with component properties

### Methods
- Convert `changeList` and `loadTags` methods to component methods
- Update `loadTags` to use Observable-based calls

### Template
- Create `home.component.html` from existing `home.html`
- Update template syntax for Angular (e.g., `ng-click` to `(click)`)
- Replace `$scope.$broadcast` usage with event bindings

### Styles
- Create `home.component.scss` for component-specific styles
- Scope styles to the component using Angular's view encapsulation

---

## 6. Breaking Changes & Impact

### API Changes

| Before | After | Breaking? |
|--------|-------|-----------|
| `$scope.$broadcast('setListTo', newList)` | `@Output() setList = new EventEmitter<string>()` | ✅ Yes |
| `$scope.$on('setPageTo', ...)` | `@Input() set pageNumber(value: number)` | ✅ Yes |
| `Tags.getAll()` | `tagsService.getAll().subscribe()` | ✅ Yes |

### Consumer Impact
- Update parent components to handle new event emitters
- Ensure all child components adapt to new input properties
- Update any components that depend on home page state changes

**Estimated Impact:** Medium (central component with multiple interactions)

---

## 7. Testing Requirements

### Unit Testing
- Test component initialization
- Test tag loading functionality
- Test list changing mechanism
- Test interaction with UserService for feed type determination

### Integration Testing
- Verify correct rendering of article list and tags
- Test tab switching functionality
- Ensure proper communication with child components (article-list, etc.)
- Verify correct behavior for authenticated and non-authenticated users

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| Broken article list display | LOW | HIGH | Thorough testing of list config and child component interaction |
| Tag loading failures | LOW | MEDIUM | Implement proper error handling for tag loading |
| User authentication state mishandling | MEDIUM | HIGH | Carefully test and handle user authentication state changes |

**Overall Risk Level:** MEDIUM

---

## 9. Definition of Done

- [ ] `HomeComponent` class created with proper Angular decorators
- [ ] All AngularJS dependencies replaced with Angular equivalents
- [ ] Tag loading implemented using Observable-based calls
- [ ] List changing mechanism updated to use Angular's component interaction methods
- [ ] Template updated to use Angular syntax
- [ ] Proper error handling implemented for all async operations
- [ ] Unit tests created and passing
- [ ] Integration tests updated and passing
- [ ] Styling preserved and scoped to the component

---

## 10. Executor Notes

### Recommended Migration Approach
1. Create the basic `HomeComponent` structure
2. Implement the tag loading functionality using TagsService
3. Set up the list configuration based on user authentication state
4. Implement the list changing mechanism using Angular's @Output
5. Update the template to use Angular syntax and bind to the new component properties
6. Implement error handling for async operations
7. Set up proper lifecycle hooks (ngOnInit) for initialization
8. Migrate and update tests

### Key Challenges
- Ensuring smooth transition from AngularJS events to Angular's component interaction methods
- Maintaining correct behavior for authenticated and non-authenticated users
- Coordinating with child components (like article-list) that may also be undergoing migration

### Helpful Resources
- [Angular Component Interaction](https://angular.io/guide/component-interaction)
- [RxJS in Angular](https://angular.io/guide/rx-library)
- [Angular Lifecycle Hooks](https://angular.io/guide/lifecycle-hooks)

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

**Blocker (if any):** None

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
# Component Migration Plan: Article Routing Module

---

> **⚠️ COMPONENT-LEVEL PLANNING - NO EXECUTION**
> 
> This document provides detailed analysis and transformation mapping for the Article routing module.
> - ✅ Analyzes component structure and dependencies
> - ✅ Maps AngularJS patterns to Angular equivalents
> - ✅ Documents what needs to transform
> - ❌ Does NOT provide implementation code
> - ❌ Does NOT execute the migration
> 
> **Handoff:** This plan is used by executor agents/developers to implement the migration.

---

```yaml
component_name: "ArticleRoutingModule"
component_type: "routing"
source_file: "src/js/article/article.config.js"
target_file: "src/app/features/article/article-routing.module.ts"
migration_status: "PENDING"
dependency_level: 4
blocking_dependencies: ["ArticleComponent", "ArticleResolver"]
created_date: "2025-10-27"
updated_date: "2025-10-27"
```

---

## 1. Component Overview

### Basic Information
- **Name:** ArticleRoutingModule
- **Type:** Routing Configuration
- **Source:** `src/js/article/article.config.js`
- **Target:** `src/app/features/article/article-routing.module.ts`
- **Lines of Code:** ~20 lines (estimated)
- **Transformation Points:** 3

### Purpose
This module defines the routing configuration for the Article feature, including URL patterns, component associations, and any necessary route resolvers or guards.

### Business Context
The Article routing is crucial for navigating to individual article pages, which is a core feature of the application. It affects how users access and interact with article content.

---

## 2. Current State Analysis

### Module Registration
```javascript
function ArticleConfig($stateProvider) {
  'ngInject';
  $stateProvider
  .state('app.article', {
    url: '/article/:slug',
    controller: 'ArticleCtrl',
    controllerAs: '$ctrl',
    templateUrl: 'article/article.html',
    title: 'Article',
    resolve: {
      article: function(Articles, $state, $stateParams) {
        return Articles.get($stateParams.slug).then(
          (article) => article,
          (err) => $state.go('app.home')
        );
      }
    }
  });
}

export default ArticleConfig;
```

### AngularJS Patterns Used

| Pattern | Count | Lines | Transformation Notes |
|---------|-------|-------|---------------------|
| UI-Router state definition | 1 | 3-17 | Convert to Angular Router configuration |
| Controller and ControllerAs syntax | 2 | 5-6 | Replace with component in route definition |
| Resolve function | 1 | 9-15 | Convert to Angular route resolver |

**Total Transformation Points:** 3

---

## 3. Dependency Analysis

### Incoming Dependencies (Who Uses This)
- Main app module (for registering routes)

### Outgoing Dependencies (What This Needs)

| Dependency | Type | Status | Migration Blocker | Notes |
|-----------|------|--------|------------------|-------|
| ArticleCtrl | Controller | PENDING | ✅ Yes | Must be migrated to ArticleComponent |
| Articles service | Service | COMPLETED | No | Assumed to be migrated in earlier phase |

**Blocking Dependencies:** ArticleComponent (formerly ArticleCtrl)

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
| `controller` and `controllerAs` | Component | Reference the migrated ArticleComponent in the route definition |
| `resolve` function | Route resolver | Create a separate `ArticleResolver` class |

### File Structure Transformation

**Source (AngularJS):**
```
src/js/article/article.config.js
```

**Target (Angular):**
```
src/app/features/article/
├── article-routing.module.ts
└── article.resolver.ts
```

---

## 5. Transformation Requirements

### Routing Configuration
- Create an `ArticleRoutingModule` class
- Define routes using Angular's `Routes` array
- Use `RouterModule.forChild()` to create the routing module

### Resolver
- Create an `ArticleResolver` class implementing `Resolve<Article>`
- Inject `ArticleService` (migrated from `Articles` service) and `Router`
- Implement `resolve` method to fetch article and handle errors

### Module Setup
- Import necessary Angular modules (`NgModule`, `RouterModule`)
- Import `ArticleComponent` and `ArticleResolver`
- Set up `@NgModule` decorator with imports, declarations, and exports

---

## 6. Breaking Changes & Impact

### API Changes

| Before | After | Breaking? |
|--------|-------|-----------|
| `$state.go('app.article')` | `router.navigate(['/article', slug])` | ✅ Yes |

### Consumer Impact
- Update all navigation to article pages to use Angular's `Router` service
- Ensure `ArticleModule` is properly imported in the main `AppModule` or lazy-loaded

**Estimated Impact:** Medium (affects navigation throughout the app)

---

## 7. Testing Requirements

### Unit Testing
- Test that routes are correctly defined
- Verify that `ArticleResolver` correctly fetches article data
- Ensure error handling redirects to home page

### Integration Testing
- Verify that navigating to `/article/:slug` loads the correct component
- Test that resolver provides article data to the component

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| Broken deep links | MEDIUM | HIGH | Thoroughly test all article URL patterns |
| Performance issues with resolver | LOW | MEDIUM | Optimize article fetching, consider caching |
| Incorrect error handling | LOW | HIGH | Implement comprehensive error handling in resolver |

**Overall Risk Level:** MEDIUM

---

## 9. Definition of Done

- [ ] `ArticleRoutingModule` is created and configured correctly
- [ ] `ArticleResolver` is implemented and integrated
- [ ] All routes from the original config are mapped to Angular routes
- [ ] Error handling for non-existent articles is implemented
- [ ] Unit tests for routing module and resolver pass
- [ ] Integration tests for article navigation pass
- [ ] No references to UI-Router or `$state` remain in the article feature

---

## 10. Executor Notes

### Recommended Migration Approach
1. Create the `article-routing.module.ts` file
2. Implement the `ArticleResolver` in a separate file
3. Define the routes using Angular's `Routes` array
4. Set up the `ArticleRoutingModule` with necessary imports and exports
5. Update `ArticleModule` to import the new routing module

### Key Challenges
- Ensuring all existing route parameters and query parameters are correctly handled
- Maintaining the same URL structure for SEO and existing deep links

### Helpful Resources
- [Angular Routing & Navigation Guide](https://angular.io/guide/router)
- [Route resolvers in Angular](https://angular.io/api/router/Resolve)

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

**Blocker (if any):** Waiting for ArticleComponent migration

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
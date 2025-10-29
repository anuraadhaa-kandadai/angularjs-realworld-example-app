# Component Migration Plan: Profile Routing Module

---

> **⚠️ COMPONENT-LEVEL PLANNING - NO EXECUTION**
> 
> This document provides detailed analysis and transformation mapping for the Profile routing module.
> - ✅ Analyzes component structure and dependencies
> - ✅ Maps AngularJS patterns to Angular equivalents
> - ✅ Documents what needs to transform
> - ❌ Does NOT provide implementation code
> - ❌ Does NOT execute the migration
> 
> **Handoff:** This plan is used by executor agents/developers to implement the migration.

---

```yaml
component_name: "ProfileRoutingModule"
component_type: "routing"
source_file: "src/js/profile/profile.config.js"
target_file: "src/app/features/profile/profile-routing.module.ts"
migration_status: "PENDING"
dependency_level: 4
blocking_dependencies: ["ProfileComponent", "ProfileArticlesComponent"]
created_date: "2025-10-27"
updated_date: "2025-10-27"
```

---

## 1. Component Overview

### Basic Information
- **Name:** ProfileRoutingModule
- **Type:** Routing Configuration
- **Source:** `src/js/profile/profile.config.js`
- **Target:** `src/app/features/profile/profile-routing.module.ts`
- **Lines of Code:** ~30 lines (estimated)
- **Transformation Points:** 4

### Purpose
This module defines the routing configuration for the Profile feature, including routes for viewing a user's profile and their articles. It sets up the necessary resolvers and handles nested routes.

### Business Context
The Profile routing is crucial for user engagement, allowing users to view their own profiles and the profiles of other users, including their published articles. This feature contributes to the social aspect of the platform.

---

## 2. Current State Analysis

### Module Registration
```javascript
function ProfileConfig($stateProvider) {
  'ngInject';
  $stateProvider
  .state('app.profile', {
    abstract: true,
    url: '/@:username',
    controller: 'ProfileCtrl',
    controllerAs: '$ctrl',
    templateUrl: 'profile/profile.html',
    resolve: {
      profile: function(Profile, $state, $stateParams) {
        return Profile.get($stateParams.username).then(
          (profile) => profile,
          (err) => $state.go('app.home')
        );
      }
    }
  })
  .state('app.profile.main', {
    url: '',
    controller: 'ProfileArticlesCtrl',
    controllerAs: '$ctrl',
    templateUrl: 'profile/profile-articles.html',
    title: 'Profile'
  });
}

export default ProfileConfig;
```

### AngularJS Patterns Used

| Pattern | Count | Lines | Transformation Notes |
|---------|-------|-------|---------------------|
| UI-Router state definition | 2 | 4-25 | Convert to Angular Router configuration |
| Nested states | 1 | 20-25 | Implement child routes in Angular |
| Controller and ControllerAs syntax | 2 | 7-8, 22-23 | Replace with components in route definitions |
| Resolve function | 1 | 10-16 | Convert to Angular route resolver |

**Total Transformation Points:** 4

---

## 3. Dependency Analysis

### Incoming Dependencies (Who Uses This)
- Main app module (for registering routes)

### Outgoing Dependencies (What This Needs)

| Dependency | Type | Status | Migration Blocker | Notes |
|-----------|------|--------|------------------|-------|
| ProfileCtrl | Controller | PENDING | ✅ Yes | Must be migrated to ProfileComponent |
| ProfileArticlesCtrl | Controller | PENDING | ✅ Yes | Must be migrated to ProfileArticlesComponent |
| Profile service | Service | COMPLETED | No | Assumed to be migrated in earlier phase |

**Blocking Dependencies:** ProfileComponent, ProfileArticlesComponent

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
| Nested states | Child routes | Use `children` property in route configuration |
| `controller` and `controllerAs` | Component | Reference the migrated components in route definitions |
| `resolve` function | Route resolver | Create a separate `ProfileResolver` service |

### File Structure Transformation

**Source (AngularJS):**
```
src/js/profile/profile.config.js
```

**Target (Angular):**
```
src/app/features/profile/
├── profile-routing.module.ts
└── profile.resolver.ts
```

---

## 5. Transformation Requirements

### Routing Configuration
- Create a `ProfileRoutingModule` class
- Define routes using Angular's `Routes` array, including child routes
- Use `RouterModule.forChild()` to create the routing module

### Route Resolver
- Create a `ProfileResolver` service implementing `Resolve<Profile>`
- Inject `ProfileService` (migrated from `Profile` service)
- Implement `resolve` method to fetch profile data and handle errors

### Module Setup
- Import necessary Angular modules (`NgModule`, `RouterModule`)
- Import `ProfileComponent`, `ProfileArticlesComponent`, and `ProfileResolver`
- Set up `@NgModule` decorator with imports, declarations, and exports

---

## 6. Breaking Changes & Impact

### API Changes

| Before | After | Breaking? |
|--------|-------|-----------|
| `$state.go('app.profile')` | `router.navigate(['/profile', username])` | ✅ Yes |
| `$stateParams.username` | `route.paramMap.get('username')` | ✅ Yes |

### Consumer Impact
- Update all navigation to profile pages to use Angular's `Router` service
- Ensure `ProfileModule` is properly imported in the main `AppModule` or lazy-loaded
- Update components to handle resolved data from route

**Estimated Impact:** Medium (affects navigation to profiles and article lists)

---

## 7. Testing Requirements

### Unit Testing
- Test that routes are correctly defined for profile and profile articles
- Verify that `ProfileResolver` correctly fetches profile data
- Ensure error handling redirects to home page on profile fetch failure

### Integration Testing
- Verify that navigating to `/@:username` loads the correct profile
- Test that child route for articles loads correctly
- Ensure proper data is passed to profile and article list components

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| Broken profile navigation | LOW | HIGH | Thorough testing of profile routes |
| Incorrect data resolution | MEDIUM | HIGH | Comprehensive unit tests for ProfileResolver |
| Child route misconfigurations | LOW | MEDIUM | Careful implementation and testing of nested routes |

**Overall Risk Level:** MEDIUM

---

## 9. Definition of Done

- [ ] `ProfileRoutingModule` is created and configured correctly
- [ ] `ProfileResolver` is implemented and integrated
- [ ] All routes from the original config are mapped to Angular routes
- [ ] Child routes are properly configured
- [ ] Error handling is implemented for profile data fetching
- [ ] Unit tests for routing module and resolver pass
- [ ] Integration tests for profile navigation pass
- [ ] No references to UI-Router or `$state` remain in the profile feature

---

## 10. Executor Notes

### Recommended Migration Approach
1. Create the `profile-routing.module.ts` file
2. Implement the `ProfileResolver` in a separate file
3. Define the routes using Angular's `Routes` array, including child routes
4. Set up the `ProfileRoutingModule` with necessary imports and exports
5. Update `ProfileModule` to import the new routing module

### Key Challenges
- Ensuring the profile resolver works correctly and handles errors appropriately
- Maintaining the correct structure for nested routes (profile and profile articles)
- Coordinating with the ProfileComponent and ProfileArticlesComponent migrations

### Helpful Resources
- [Angular Routing & Navigation Guide](https://angular.io/guide/router)
- [Route resolvers in Angular](https://angular.io/api/router/Resolve)
- [Child Routes in Angular](https://angular.io/guide/router#child-routes)

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

**Blocker (if any):** Waiting for ProfileComponent and ProfileArticlesComponent migrations

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
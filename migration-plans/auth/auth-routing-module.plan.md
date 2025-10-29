# Component Migration Plan: Auth Routing Module

---

> **⚠️ COMPONENT-LEVEL PLANNING - NO EXECUTION**
> 
> This document provides detailed analysis and transformation mapping for the Auth routing module.
> - ✅ Analyzes component structure and dependencies
> - ✅ Maps AngularJS patterns to Angular equivalents
> - ✅ Documents what needs to transform
> - ❌ Does NOT provide implementation code
> - ❌ Does NOT execute the migration
> 
> **Handoff:** This plan is used by executor agents/developers to implement the migration.

---

```yaml
component_name: "AuthRoutingModule"
component_type: "routing"
source_file: "src/js/auth/auth.config.js"
target_file: "src/app/features/auth/auth-routing.module.ts"
migration_status: "PENDING"
dependency_level: 4
blocking_dependencies: ["AuthComponent"]
created_date: "2025-10-27"
updated_date: "2025-10-27"
```

---

## 1. Component Overview

### Basic Information
- **Name:** AuthRoutingModule
- **Type:** Routing Configuration
- **Source:** `src/js/auth/auth.config.js`
- **Target:** `src/app/features/auth/auth-routing.module.ts`
- **Lines of Code:** ~20 lines (estimated)
- **Transformation Points:** 3

### Purpose
This module defines the routing configuration for the Auth feature, including URL patterns and component associations for login and registration pages.

### Business Context
The Auth routing is crucial for user authentication flows, allowing users to access login and registration pages. It's a critical part of the application's security and user management system.

---

## 2. Current State Analysis

### Module Registration
```javascript
function AuthConfig($stateProvider) {
  'ngInject';
  $stateProvider
  .state('app.login', {
    url: '/login',
    controller: 'AuthCtrl as $ctrl',
    templateUrl: 'auth/auth.html',
    title: 'Sign in',
    resolve: {
      auth: function(User) {
        return User.ensureAuthIs(false);
      }
    }
  })
  .state('app.register', {
    url: '/register',
    controller: 'AuthCtrl as $ctrl',
    templateUrl: 'auth/auth.html',
    title: 'Sign up',
    resolve: {
      auth: function(User) {
        return User.ensureAuthIs(false);
      }
    }
  });
}

export default AuthConfig;
```

### AngularJS Patterns Used

| Pattern | Count | Lines | Transformation Notes |
|---------|-------|-------|---------------------|
| UI-Router state definition | 2 | 4-27 | Convert to Angular Router configuration |
| Controller and ControllerAs syntax | 2 | 6, 19 | Replace with component in route definition |
| Resolve function | 2 | 9-11, 22-24 | Convert to Angular route guard |

**Total Transformation Points:** 3

---

## 3. Dependency Analysis

### Incoming Dependencies (Who Uses This)
- Main app module (for registering routes)

### Outgoing Dependencies (What This Needs)

| Dependency | Type | Status | Migration Blocker | Notes |
|-----------|------|--------|------------------|-------|
| AuthCtrl | Controller | PENDING | ✅ Yes | Must be migrated to AuthComponent |
| User service | Service | COMPLETED | No | Assumed to be migrated in earlier phase |

**Blocking Dependencies:** AuthComponent (formerly AuthCtrl)

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
| `controller` and `controllerAs` | Component | Reference the migrated AuthComponent in the route definition |
| `resolve` function | Route guard | Create a separate `AuthGuard` service |

### File Structure Transformation

**Source (AngularJS):**
```
src/js/auth/auth.config.js
```

**Target (Angular):**
```
src/app/features/auth/
├── auth-routing.module.ts
└── auth.guard.ts
```

---

## 5. Transformation Requirements

### Routing Configuration
- Create an `AuthRoutingModule` class
- Define routes using Angular's `Routes` array
- Use `RouterModule.forChild()` to create the routing module

### Route Guard
- Create an `AuthGuard` service implementing `CanActivate`
- Inject `UserService` (migrated from `User` service)
- Implement `canActivate` method to check authentication status

### Module Setup
- Import necessary Angular modules (`NgModule`, `RouterModule`)
- Import `AuthComponent` and `AuthGuard`
- Set up `@NgModule` decorator with imports, declarations, and exports

---

## 6. Breaking Changes & Impact

### API Changes

| Before | After | Breaking? |
|--------|-------|-----------|
| `$state.go('app.login')` | `router.navigate(['/login'])` | ✅ Yes |
| `$state.go('app.register')` | `router.navigate(['/register'])` | ✅ Yes |

### Consumer Impact
- Update all navigation to login and register pages to use Angular's `Router` service
- Ensure `AuthModule` is properly imported in the main `AppModule` or lazy-loaded

**Estimated Impact:** Medium (affects navigation to auth pages throughout the app)

---

## 7. Testing Requirements

### Unit Testing
- Test that routes are correctly defined for login and register
- Verify that `AuthGuard` correctly checks authentication status
- Ensure unauthenticated users can access login and register routes

### Integration Testing
- Verify that navigating to `/login` and `/register` loads the correct component
- Test that authenticated users are redirected away from login and register pages

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| Broken authentication flow | LOW | HIGH | Thorough testing of auth routes and guard |
| Incorrect route protection | LOW | HIGH | Comprehensive unit tests for AuthGuard |
| Navigation issues | LOW | MEDIUM | Careful migration of all $state.go() calls |

**Overall Risk Level:** MEDIUM

---

## 9. Definition of Done

- [ ] `AuthRoutingModule` is created and configured correctly
- [ ] `AuthGuard` is implemented and integrated
- [ ] All routes from the original config are mapped to Angular routes
- [ ] Route protection is implemented for authenticated users
- [ ] Unit tests for routing module and guard pass
- [ ] Integration tests for auth navigation pass
- [ ] No references to UI-Router or `$state` remain in the auth feature

---

## 10. Executor Notes

### Recommended Migration Approach
1. Create the `auth-routing.module.ts` file
2. Implement the `AuthGuard` in a separate file
3. Define the routes using Angular's `Routes` array
4. Set up the `AuthRoutingModule` with necessary imports and exports
5. Update `AuthModule` to import the new routing module

### Key Challenges
- Ensuring the authentication check works correctly in the new guard
- Maintaining the same URL structure for consistency

### Helpful Resources
- [Angular Routing & Navigation Guide](https://angular.io/guide/router)
- [Route guards in Angular](https://angular.io/guide/router#preventing-unauthorized-access)

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

**Blocker (if any):** Waiting for AuthComponent migration

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
# Component Migration Plan: AuthInterceptor

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
component_name: "AuthInterceptor"
component_type: "interceptor"
source_file: "src/js/config/auth.interceptor.js"
target_file: "src/app/core/interceptors/auth.interceptor.ts"
migration_status: "PENDING"
dependency_level: 1
blocking_dependencies: ["JWT", "AppConstants"]
created_date: "2025-10-24"
updated_date: "2025-10-24"
```

---

## 1. Component Overview

### Basic Information
- **Name:** AuthInterceptor
- **Type:** HTTP Interceptor
- **Source:** `src/js/config/auth.interceptor.js`
- **Target:** `src/app/core/interceptors/auth.interceptor.ts`
- **Lines of Code:** 27 lines
- **Transformation Points:** 5 (ngInject, JWT service, AppConstants, $window, $q)

### Purpose
This interceptor handles two main tasks:
1. Automatically attaches the Authorization header to outgoing API requests.
2. Handles 401 (Unauthorized) responses by clearing the JWT token and reloading the page.

### Business Context
This interceptor is crucial for maintaining the authentication state of the application. It ensures that the API requests are properly authenticated and handles session expiration or unauthorized access scenarios.

---

## 2. Current State Analysis

### Module Registration
The current file exports a function `authInterceptor` which is likely registered as an HTTP interceptor in the AngularJS application.

### Injected Dependencies
```javascript
function authInterceptor(JWT, AppConstants, $window, $q) {
  'ngInject'
  // ...
}
```

### AngularJS Patterns Used

| Pattern | Count | Lines | Transformation Notes |
|---------|-------|-------|---------------------|
| `'ngInject'` | 1 | 2 | Remove, use TypeScript for DI |
| JWT service usage | 2 | 7, 17 | Update to use Angular's HttpInterceptor |
| AppConstants usage | 1 | 7 | Import and use AppConstants |
| `$window` usage | 1 | 19 | Replace with Angular's `window` |
| `$q` usage | 1 | 21 | Replace with RxJS operators |

**Total Transformation Points:** 5

### Code Structure Overview

**Methods:**
- Total methods: 2 (`request`, `responseError`)
- Public methods: 2
- Private/helper methods: 0

---

## 3. Dependency Analysis

### Incoming Dependencies (Who Uses This)
This interceptor is likely used in the main application module's HTTP provider configuration.

**Consumer Count:** 1 (main app module)

### Outgoing Dependencies (What This Needs)

| Dependency | Type | Status | Migration Blocker | Notes |
|-----------|------|--------|------------------|-------|
| JWT | Service | PENDING | Yes | Needs to be migrated first |
| AppConstants | Constant | COMPLETED | No | Already migrated |
| $window | AngularJS Service | N/A | No | Will be replaced with window |
| $q | AngularJS Service | N/A | No | Will be replaced with RxJS |

**Blocking Dependencies:** JWT service

### Third-Party Dependencies
None.

---

## 4. Transformation Mapping

### Pattern Transformations

| AngularJS Pattern | Angular Equivalent | Transformation Approach |
|-------------------|-------------------|------------------------|
| HTTP Interceptor | HttpInterceptor | Implement Angular's HttpInterceptor interface |
| JWT.get() | JwtService.getToken() | Update to use the migrated JWT service |
| AppConstants.api | environment.apiUrl | Use Angular environment configuration |
| $window.location.reload() | window.location.reload() | Use the global window object |
| $q.reject(rejection) | throwError(rejection) | Use RxJS throwError operator |

### File Structure Transformation

**Source (AngularJS):**
```
src/js/config/auth.interceptor.js (single file)
```

**Target (Angular):**
```
src/app/core/
├── interceptors/
│   └── auth.interceptor.ts
└── services/
    └── jwt.service.ts
```

### Interface/Type Definitions Needed
```typescript
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthInterceptor extends HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
```

---

## 5. Transformation Requirements

### Properties & State
- **Total properties to migrate:** 0
- **Type definitions needed:** 1 (HttpInterceptor interface)
- **State management approach:** Stateless interceptor

### Methods
- **Total methods to migrate:** 2 (`request`, `responseError`)
- **Promise → Observable conversions:** 1 (responseError method)

### Template
No template changes required (not a component with a template).

### Lifecycle Hooks Needed
None required for an interceptor.

### Cleanup Requirements
None required.

---

## 6. Breaking Changes & Impact

### API Changes
The interceptor interface will change, but this should not affect other parts of the application directly.

### Consumer Impact
**Components that need updates:**
- [ ] Main app module (to provide the new interceptor)

**Estimated Impact:** Low - Localized change in app module configuration

---

## 7. Testing Requirements

### Unit Testing
- **Test scope:** 2 test cases
- **Coverage target:** 100%
- **Critical paths to test:**
  - [ ] Authorization header is added correctly
  - [ ] 401 response is handled correctly (JWT cleared, page reloaded)

### Integration Testing
- [ ] Verify interceptor works with actual HTTP requests
- [ ] Ensure 401 handling works end-to-end

### Visual/E2E Testing
- [ ] Verify application behaves correctly on session expiration (redirects to login)

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| JWT service incompatibility | LOW | HIGH | Ensure JWT service is migrated and tested first |
| Missing 401 handling | LOW | HIGH | Comprehensive unit and integration tests |
| API URL mismatch | LOW | MEDIUM | Verify environment configuration during setup |

**Overall Risk Level:** LOW

---

## 9. Definition of Done

### Code Quality
- [ ] TypeScript compiles with strict mode
- [ ] No `any` types used
- [ ] ESLint passes with no warnings
- [ ] Code review approved

### Functionality
- [ ] Authorization header added correctly to API requests
- [ ] 401 responses handled correctly
- [ ] JWT cleared on unauthorized responses
- [ ] Page reload triggered on session expiration

### Testing
- [ ] Unit tests pass (100% coverage)
- [ ] Integration tests for HTTP requests pass
- [ ] E2E test for session expiration scenario passes

### Documentation
- [ ] Interceptor usage documented in application
- [ ] JWT service integration explained
- [ ] 401 handling behavior documented

### Integration
- [ ] No AngularJS dependencies remain
- [ ] Provided correctly in AppModule
- [ ] Works with Angular HttpClient

---

## 10. Executor Notes

### Recommended Migration Approach
1. Migrate JWT service first (if not already done).
2. Create new `auth.interceptor.ts` implementing HttpInterceptor.
3. Update request method to use HttpRequest clone for immutability.
4. Replace responseError with RxJS catchError operator.
5. Update AppModule to provide the new interceptor.
6. Ensure environment.ts contains the API URL configuration.

### Key Challenges
- Ensuring all API requests are properly intercepted
- Maintaining the correct order of interceptors if multiple exist

### Helpful Resources
- [Angular - HTTP Interceptors](https://angular.io/guide/http#intercepting-requests-and-responses)
- [RxJS - catchError](https://rxjs.dev/api/operators/catchError)
- [Angular - Environment configuration](https://angular.io/guide/build#configuring-application-environments)

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

**Blocker (if any):** JWT service migration

**Last Updated:** 2025-10-24

---

## 12. Notes & Lessons Learned

- The transition from AngularJS interceptors to Angular HttpInterceptors is relatively straightforward but requires careful attention to RxJS usage.
- Consider implementing a more robust error handling strategy, possibly with a dedicated error handling service.

---

## 13. Revision History

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-10-24 | 1.0 | Initial analysis | Planner Agent |

---

**END OF COMPONENT MIGRATION PLAN**
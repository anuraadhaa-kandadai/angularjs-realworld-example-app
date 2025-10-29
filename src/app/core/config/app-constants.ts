export const AppConstants = {
  api: 'http://localhost:8080/api',
  jwtKey: 'jwtToken',
  appName: 'conduit'
} as const;

export type AppConstants = typeof AppConstants;
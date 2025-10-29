export interface Environment {
  production: boolean;
  appName: string;
  api_url: string;
  jwtTokenName: string;
}

export const environment: Environment = {
  production: false,
  appName: 'conduit',
  api_url: 'http://localhost:8080/api',
  jwtTokenName: 'jwtToken'
};
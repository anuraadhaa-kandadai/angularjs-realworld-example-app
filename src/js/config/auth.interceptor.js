function authInterceptor(JWT, AppConstants, $window, $q) {
  'ngInject'

  return {
    // automatically attach Authorization header
    request: function(config) {
      if(config.url.indexOf(AppConstants.api) === 0 && JWT.get()) {
        config.headers.Authorization = 'Token ' + JWT.get();
        // Debug logging for development
        if (AppConstants.debug) {
          console.log('Auth interceptor: Adding token to request', config.url);
        }
      }
      return config;
    },

    // Handle 401
    responseError: function(rejection) {
      if (rejection.status === 401) {
        // clear any JWT token being stored
        JWT.destroy();
        // Debug logging for development
        if (AppConstants.debug) {
          console.log('Auth interceptor: 401 received, clearing token');
        }
        // do a hard page refresh
        $window.location.reload();
      }
      return $q.reject(rejection);
    }

  }
}

export default authInterceptor;
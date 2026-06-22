export default class JWT {
  constructor(AppConstants, $window) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$window = $window;
  }

  save(token) {
    this._$window.localStorage[this._AppConstants.jwtKey] = token;
    if (this._AppConstants.debug) {
      console.log('JWT Service: Token saved');
    }
  }

  get() {
    const token = this._$window.localStorage[this._AppConstants.jwtKey];
    if (this._AppConstants.debug && token) {
      console.log('JWT Service: Token retrieved');
    }
    return token;
  }

  destroy() {
    this._$window.localStorage.removeItem(this._AppConstants.jwtKey);
    if (this._AppConstants.debug) {
      console.log('JWT Service: Token destroyed');
    }
  }

  // Helper method to check if token exists
  exists() {
    return !!this.get();
  }

  // Helper method to get authorization header value
  getAuthHeader() {
    const token = this.get();
    return token ? 'Token ' + token : null;
  }

}
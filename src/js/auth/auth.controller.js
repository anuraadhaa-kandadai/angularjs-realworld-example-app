class AuthCtrl {
  constructor(User, $state, $rootScope) {
    'ngInject';

    this._User = User;
    this._$state = $state;
    this._$rootScope = $rootScope;

    this.title = $state.current.title;
    this.authType = $state.current.name.replace('app.', '');

  }

  submitForm() {
    this.isSubmitting = true;

    this._User.attemptAuth(this.authType, this.formData).then(
      (res) => {
        // Broadcast authentication change to trigger component updates
        this._$rootScope.$broadcast('user:authenticated', res.data.user);
        
        // Navigate to home which will trigger reactive updates
        this._$state.go('app.home');
      },
      (err) => {
        this.isSubmitting = false;
        this.errors = err.data.errors;
      }
    )
  }
}

export default AuthCtrl;
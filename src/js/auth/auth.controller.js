class AuthCtrl {
  constructor(User, $state, $timeout) {
    'ngInject';

    this._User = User;
    this._$state = $state;
    this._$timeout = $timeout;

    this.title = $state.current.title;
    this.authType = $state.current.name.replace('app.', '');

  }

  submitForm() {
    this.isSubmitting = true;

    this._User.attemptAuth(this.authType, this.formData).then(
      (res) => {
        // Add a small delay to ensure authentication state is fully propagated
        this._$timeout(() => {
          this._$state.go('app.home');
        }, 50);
      },
      (err) => {
        this.isSubmitting = false;
        this.errors = err.data.errors;
      }
    )
  }
}

export default AuthCtrl;
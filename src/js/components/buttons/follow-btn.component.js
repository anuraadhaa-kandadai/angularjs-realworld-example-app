class FollowBtnCtrl {
  constructor(Profile, User, $state, $scope) {
    'ngInject';

    this._Profile = Profile;
    this._User = User;
    this._$state = $state;
    
    // Watch for authentication changes to update button visibility
    $scope.$watch(
      () => this._User.current,
      (newUser) => {
        this.isAuthenticated = !!newUser;
      }
    );
    
    // Initialize authentication state
    this.isAuthenticated = !!this._User.current;
  }

  submit() {
    this.isSubmitting = true;

    if (!this._User.current) {
      this._$state.go('app.register');
      return;
    }

    // If following already, unfollow
    if (this.user.following) {
      this._Profile.unfollow(this.user.username).then(
        () => {
          this.isSubmitting = false;
          this.user.following = false;
        }
      )

    // Otherwise, follow them
    } else {
      this._Profile.follow(this.user.username).then(
        () => {
          this.isSubmitting = false;
          this.user.following = true;
        }
      )
    }


  }
}

let FollowBtn= {
  bindings: {
    user: '='
  },
  controller: FollowBtnCtrl,
  templateUrl: 'components/buttons/follow-btn.html'
};

export default FollowBtn;
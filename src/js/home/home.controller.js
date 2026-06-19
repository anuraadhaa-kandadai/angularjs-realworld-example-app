class HomeCtrl {
  constructor(User, Tags, AppConstants, $scope) {
    'ngInject';

    this.appName = AppConstants.appName;
    this._$scope = $scope;
    this._User = User;

    // Get list of all tags
    Tags
      .getAll()
      .then(
        (tags) => {
          this.tagsLoaded = true;
          this.tags = tags
        }
      );

    // Set current list to either feed or all, depending on auth status.
    this.listConfig = {
      type: User.current ? 'feed' : 'all'
    };

    // Watch for authentication state changes and update feed accordingly
    $scope.$watch(
      () => User.current,
      (newUser, oldUser) => {
        // If authentication state changed (login/logout)
        if ((newUser && !oldUser) || (!newUser && oldUser)) {
          // Update list config type based on new auth state
          const newType = newUser ? 'feed' : 'all';
          if (this.listConfig.type !== newType || newUser) {
            this.changeList({ type: newType });
          }
        }
      }
    );

  }

  changeList(newList) {
    this._$scope.$broadcast('setListTo', newList);
  }


}

export default HomeCtrl;
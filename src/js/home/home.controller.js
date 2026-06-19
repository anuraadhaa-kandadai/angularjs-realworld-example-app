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

    // Watch for authentication state changes and automatically refresh feed
    $scope.$watch(() => User.current, (newUser, oldUser) => {
      if (newUser !== oldUser) {
        // User authentication state has changed
        if (newUser && !oldUser) {
          // User just logged in - switch to personalized feed
          this.changeList({ type: 'feed' });
        } else if (!newUser && oldUser) {
          // User just logged out - switch to global feed
          this.changeList({ type: 'all' });
        }
      }
    });

  }

  changeList(newList) {
    // Update the local listConfig to keep UI state in sync
    this.listConfig = newList;
    // Broadcast the change to trigger article list refresh
    this._$scope.$broadcast('setListTo', newList);
  }


}

export default HomeCtrl;
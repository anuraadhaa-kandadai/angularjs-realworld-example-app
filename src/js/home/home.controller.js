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

    // Watch for authentication state changes
    $scope.$watch(() => User.current, (newUser, oldUser) => {
      if (newUser !== oldUser) {
        // Update list configuration when auth state changes
        const newType = newUser ? 'feed' : 'all';
        if (this.listConfig.type !== newType) {
          this.listConfig = {
            type: newType
          };
          // Broadcast the change to child components
          this._$scope.$broadcast('setListTo', this.listConfig);
        }
      }
    });

  }

  changeList(newList) {
    this._$scope.$broadcast('setListTo', newList);
  }


}

export default HomeCtrl;
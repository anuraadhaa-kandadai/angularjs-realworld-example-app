class HomeCtrl {
  constructor(User, Tags, AppConstants, $scope, $timeout) {
    'ngInject';

    this.appName = AppConstants.appName;
    this._$scope = $scope;
    this._User = User;
    this._$timeout = $timeout;

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
    this.checkAuthAndUpdateFeed();

    // Listen for authentication events
    $scope.$on('userAuthenticated', () => {
      this.checkAuthAndUpdateFeed();
    });

    // Listen for logout events
    $scope.$on('userLoggedOut', () => {
      this.checkAuthAndUpdateFeed();
    });

  }

  checkAuthAndUpdateFeed() {
    // Use a small delay to ensure User.current is properly updated
    this._$timeout(() => {
      const newType = this._User.current ? 'feed' : 'all';
      if (this.listConfig.type !== newType) {
        this.listConfig = {
          type: newType
        };
        // Broadcast the change to update the article list
        this._$scope.$broadcast('setListTo', this.listConfig);
      }
    }, 100);
  }

  changeList(newList) {
    this._$scope.$broadcast('setListTo', newList);
  }

}

export default HomeCtrl;
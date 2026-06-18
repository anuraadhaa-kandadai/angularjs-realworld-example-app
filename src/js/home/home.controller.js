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
    $scope.$watch(() => this._User.current, (newUser, oldUser) => {
      // Only react to actual changes (not initial load)
      if (newUser !== oldUser) {
        this.setListTo(newUser ? 'feed' : 'all');
      }
    });

  }

  changeList(newList) {
    this._$scope.$broadcast('setListTo', newList);
  }

  setListTo(type, filters = {}) {
    // Create a new config object to trigger ArticleListComponent's change detection
    this.listConfig = { 
      type: type, 
      filters: { ...filters } // Spread to ensure new object reference
    };
    
    // Broadcast the change to the article list component
    this._$scope.$broadcast('setListTo', this.listConfig);
  }

}

export default HomeCtrl;
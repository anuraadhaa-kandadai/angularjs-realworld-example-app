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

    // Watch for authentication state changes to update feed type
    $scope.$watch(() => this._User.current, (newUser, oldUser) => {
      // Only update if authentication state actually changed
      if ((!!newUser) !== (!!oldUser)) {
        // Create new listConfig object to ensure proper change detection
        this.listConfig = {
          type: newUser ? 'feed' : 'all'
        };
        
        // Broadcast the change to update article list
        this._$scope.$broadcast('setListTo', this.listConfig);
      }
    });
  }

  changeList(newList) {
    this._$scope.$broadcast('setListTo', newList);
  }

}

export default HomeCtrl;
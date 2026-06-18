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

    // Set initial list configuration based on current auth status
    this.listConfig = {
      type: User.current ? 'feed' : 'all'
    };

    // Watch for authentication state changes
    $scope.$watch(() => this._User.current, (newUser, oldUser) => {
      // Only update if authentication state actually changed
      if ((!!newUser) !== (!!oldUser)) {
        const newType = newUser ? 'feed' : 'all';
        
        // Update list configuration and refresh the feed
        this.listConfig = {
          type: newType
        };
        
        // Broadcast the change to update the article list
        this.changeList(this.listConfig);
      }
    });

  }

  changeList(newList) {
    this._$scope.$broadcast('setListTo', newList);
  }


}

export default HomeCtrl;
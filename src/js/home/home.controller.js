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

    // Listen for authentication state changes and update list configuration
    const authStateChangeHandler = (event, authData) => {
      console.log('HomeCtrl: Authentication state changed', authData);
      
      // Create new config object with updated type
      const newListConfig = {
        type: authData.isAuthenticated ? 'feed' : 'all'
      };
      
      // Only update if the type actually changed
      if (newListConfig.type !== this.listConfig.type) {
        console.log('HomeCtrl: Updating list config from', this.listConfig.type, 'to', newListConfig.type);
        this.listConfig = newListConfig;
        
        // Force change detection and refresh
        this._$scope.$apply(() => {
          this.changeList(newListConfig);
        });
      }
    };

    // Register authentication state change listener
    $scope.$on('authenticationStateChanged', authStateChangeHandler);

    // Cleanup listener when scope is destroyed
    $scope.$on('$destroy', () => {
      // Listeners are automatically cleaned up with scope destruction in AngularJS
    });

  }

  changeList(newList) {
    console.log('HomeCtrl: changeList called with', newList);
    this._$scope.$broadcast('setListTo', newList);
  }


}

export default HomeCtrl;
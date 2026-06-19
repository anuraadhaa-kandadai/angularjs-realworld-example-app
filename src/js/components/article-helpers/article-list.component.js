class ArticleListCtrl {
  constructor(Articles, $scope, User) {
    'ngInject';

    this._Articles = Articles;
    this._$scope = $scope;
    this._User = User;

    this.setListTo(this.listConfig);

    $scope.$on('setListTo', (ev, newList) => {
      console.log('ArticleListCtrl: Received setListTo event with', newList);
      this.setListTo(newList);
    });

    $scope.$on('setPageTo', (ev, pageNumber) => {
      this.setPageTo(pageNumber);
    });

    // Direct authentication state monitoring for article list refresh
    const authChangeHandler = (event, authData) => {
      console.log('ArticleListCtrl: Authentication state changed', authData);
      
      // Skip if no config set yet
      if (!this.listConfig) {
        return;
      }

      // Determine expected list type based on auth state
      const expectedType = authData.isAuthenticated ? 'feed' : 'all';
      
      // If current config type doesn't match expected type, refresh the list
      if (this.listConfig.type !== expectedType) {
        console.log('ArticleListCtrl: Auth state requires list type change from', this.listConfig.type, 'to', expectedType);
        
        // Apply the change and refresh
        $scope.$apply(() => {
          this.setListTo({ type: expectedType });
        });
      } else if (authData.previousAuthState !== authData.isAuthenticated) {
        // Even if type matches, refresh the list when auth state changes
        console.log('ArticleListCtrl: Refreshing list due to auth state change');
        $scope.$apply(() => {
          this.runQuery();
        });
      }
    };

    // Register authentication change listener
    $scope.$on('authenticationStateChanged', authChangeHandler);

  }

  setListTo(newList) {
    console.log('ArticleListCtrl: setListTo called with', newList);
    // Set the current list to an empty array
    this.list = [];

    // Create new object reference for better change detection
    this.listConfig = Object.assign({}, newList);
    
    // Add JSON comparison for change detection debugging
    console.log('ArticleListCtrl: New listConfig set to', JSON.stringify(this.listConfig));

    this.runQuery();
  }

  setPageTo(pageNumber) {
    this.listConfig.currentPage = pageNumber;

    this.runQuery();
  }


 runQuery() {
    console.log('ArticleListCtrl: runQuery called with config', JSON.stringify(this.listConfig));
    // Show the loading indicator
    this.loading = true;
    this.listConfig = this.listConfig || {};

    // Create an object for this query
    let queryConfig = {
      type: this.listConfig.type || undefined,
      filters: this.listConfig.filters || {}
    };

    // Set the limit filter from the component's attribute
    queryConfig.filters.limit = this.limit;

    // If there is no page set, set page as 1
    if (!this.listConfig.currentPage) {
      this.listConfig.currentPage = 1;
    }

    // Add the offset filter
    queryConfig.filters.offset = (this.limit * (this.listConfig.currentPage - 1));

    console.log('ArticleListCtrl: Executing query with config', JSON.stringify(queryConfig));

    // Run the query
    this._Articles
      .query(queryConfig)
      .then(
        (res) => {
          this.loading = false;

          // Update list and total pages
          this.list = res.articles;
          console.log('ArticleListCtrl: Query completed, loaded', res.articles.length, 'articles');

          this.listConfig.totalPages = Math.ceil(res.articlesCount / this.limit);
        }
      );
  }

}

let ArticleList = {
  bindings: {
    limit: '=',
    listConfig: '='
  },
  controller: ArticleListCtrl,
  templateUrl: 'components/article-helpers/article-list.html'
};

export default ArticleList;
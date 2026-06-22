class ArticleListCtrl {
  constructor(Articles, $scope, User) {
    'ngInject';

    this._Articles = Articles;
    this._User = User;

    this.setListTo(this.listConfig);

    $scope.$on('setListTo', (ev, newList) => {
      this.setListTo(newList);
    });

    $scope.$on('setPageTo', (ev, pageNumber) => {
      this.setPageTo(pageNumber);
    });

    // Listen for authentication state changes and refresh if needed
    $scope.$on('userAuthenticated', () => {
      // If we're showing 'all' feed but user is now authenticated, 
      // we might need to refresh to show proper authenticated content
      if (this.listConfig && this.listConfig.type === 'all') {
        this.runQuery();
      }
    });

    $scope.$on('userLoggedOut', () => {
      // If we're showing 'feed' but user is now logged out, 
      // we need to refresh to show public content
      if (this.listConfig && this.listConfig.type === 'feed') {
        this.runQuery();
      }
    });

  }

  setListTo(newList) {
    // Set the current list to an empty array
    this.list = [];

    // Set listConfig to the new list's config
    this.listConfig = newList;

    this.runQuery();
  }

  setPageTo(pageNumber) {
    this.listConfig.currentPage = pageNumber;

    this.runQuery();
  }


 runQuery() {
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

    // Run the query
    this._Articles
      .query(queryConfig)
      .then(
        (res) => {
          this.loading = false;

          // Update list and total pages
          this.list = res.articles;

          this.listConfig.totalPages = Math.ceil(res.articlesCount / this.limit);
        },
        (err) => {
          this.loading = false;
          console.error('Error loading articles:', err);
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
class ArticlePreviewCtrl {
  constructor(User, $scope) {
    'ngInject';
    
    this._User = User;
    
    // Watch for authentication changes to update component state
    $scope.$watch(
      () => this._User.current,
      (newUser) => {
        this.isAuthenticated = !!newUser;
        this.currentUser = newUser;
      }
    );
    
    // Initialize authentication state
    this.isAuthenticated = !!this._User.current;
    this.currentUser = this._User.current;
  }
}

let ArticlePreview = {
  bindings: {
    article: '='
  },
  controller: ArticlePreviewCtrl,
  templateUrl: 'components/article-helpers/article-preview.html'
};

export default ArticlePreview;
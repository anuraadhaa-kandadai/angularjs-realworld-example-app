class ArticlePreviewCtrl {
  constructor(User, $scope) {
    'ngInject';

    this._User = User;
    this.isAuthenticated = !!User.current;

    // Watch for authentication state changes
    $scope.$watch(() => User.current, (newUser) => {
      this.isAuthenticated = !!newUser;
    });
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
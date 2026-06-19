class FavoriteBtnCtrl {
  constructor(User, Articles, $state, $scope) {
    'ngInject';

    this._User = User;
    this._Articles = Articles;
    this._$state = $state;
    this.isAuthenticated = !!User.current;

    // Watch for authentication state changes
    $scope.$watch(() => User.current, (newUser) => {
      this.isAuthenticated = !!newUser;
    });

  }

  submit() {
    this.isSubmitting = true;

    if (!this._User.current) {
      this._$state.go('app.register');
      return;
    }

    if (this.article.favorited) {
      this._Articles.unfavorite(this.article.slug).then(
        () => {
          this.isSubmitting = false;
          this.article.favorited = false;
          this.article.favoritesCount--;
        }
      )

    } else {
      this._Articles.favorite(this.article.slug).then(
        () => {
          this.isSubmitting = false;
          this.article.favorited = true;
          this.article.favoritesCount++;
        }
      )
    }

  }

}

let FavoriteBtn= {
  bindings: {
    article: '='
  },
  transclude: true,
  controller: FavoriteBtnCtrl,
  templateUrl: 'components/buttons/favorite-btn.html'
};

export default FavoriteBtn;
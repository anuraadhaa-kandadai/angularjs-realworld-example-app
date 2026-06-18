export interface ArticleListConfig {
  type: string;

  filters: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  };
  
  // Optional property to trigger refresh when authentication state changes
  refreshTrigger?: number;
}
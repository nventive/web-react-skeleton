export interface IPostsResponse<T> {
  limit: number;
  skip: number;
  total: number;
  posts: T[];
}

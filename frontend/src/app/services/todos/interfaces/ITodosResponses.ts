export interface ITodosResponse<T> {
  limit: number;
  skip: number;
  total: number;
  todos: T[];
}

 export interface Todo {
  id: number;
  todo: string
  completed: boolean
  user_id: number
}
export interface TodoResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export interface Todo {
  id: number;
  todo: string
  completed: boolean
  user_id: number
  isDeleted?: boolean
  deletedOn?: string
}

export interface TodoResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}
export interface TodoCreate {
  id: number;
  todo: string
  completed: boolean
  user_id: number
}

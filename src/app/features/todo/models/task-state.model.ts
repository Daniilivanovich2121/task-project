import {Todo} from './todo.model';

export interface TaskStateModel {
 isLoading: boolean;
 tasks: Todo[];
 error: any;
}
export const TASK_INITIAL_STATE: TaskStateModel = {
  isLoading: false,
  tasks: [],
  error: null,
}

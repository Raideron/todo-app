import { TodoListItem } from './types/todo-list-item';

export const isTaskRefined = (task: TodoListItem): boolean => !!task.estimate && !!task.impact;

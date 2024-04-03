import { TodoListItem } from './types/todo-list-item';

export const getPrioScore = (item: TodoListItem): number => {
  if (item.isCompleted) {
    return -1;
  }

  const estimate = item.estimate ?? 0;
  const impact = item.impact ?? 0;

  return impact / (estimate + 1);
};

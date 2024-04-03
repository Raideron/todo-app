import { TodoListItem } from './types/todo-list-item';

export const getPrioScore = (item: TodoListItem): number => {
  if (item.isCompleted) {
    return -1;
  }

  const impact = item.impact || 2;
  const confidence = item.confidence || 80;
  const estimate = item.estimate || 1;
  const daysRemaining = getDaysRemaining(item) ?? 30;

  return (impact * confidence) / Math.max(estimate * daysRemaining, 1);
};

export const getDaysRemaining = (item: TodoListItem): number | null => {
  const deadline = item.deadline;

  if (!deadline) {
    return null;
  }

  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return diffDays;
};

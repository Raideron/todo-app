import { TodoListItem } from './types/todo-list-item';

export const getPrioScore = (item: TodoListItem): number => {
  if (item.isCompleted) {
    return -2;
  }

  if (item.startDate && item.startDate > new Date()) {
    return -1;
  }

  const impact = item.impact || 2;
  const confidence = item.confidence || 80;
  const estimate = item.estimate || 1;
  const daysRemaining = getDaysRemaining(item.deadline) ?? 30;

  return (impact * confidence) / Math.max(estimate * daysRemaining, 1);
};

export const getDaysRemaining = (date: Date | undefined | null): number | null => {
  if (!date) {
    return null;
  }

  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return diffDays;
};

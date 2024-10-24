import { getDaysRemaining, getPrioScore } from './get-prio-score';
import { TodoListItem } from './types/todo-list-item';

describe('getPrioScore', () => {
  it('should return the correct score', () => {
    const item: TodoListItem = {
      id: '1',
      todo_list_id: '1',
      created: new Date(),
      updated: new Date(),
      intervalInDays: 1,
      name: 'Test',
      estimate: 1,
      confidence: 80,
      impact: 2,
    };
    expect(getPrioScore(item)).toBe(5.333333333333333);
  });

  it('should return the correct score', () => {
    const item: TodoListItem = {
      id: '1',
      todo_list_id: '1',
      created: new Date(),
      updated: new Date(),
      intervalInDays: 1,
      name: 'Test',
      estimate: 0.5,
      confidence: 80,
      impact: 2,
    };
    expect(getPrioScore(item)).toBe(10.666666666666666);
  });

  it('should return the correct score', () => {
    const item: TodoListItem = {
      id: '1',
      todo_list_id: '1',
      created: new Date(),
      updated: new Date(),
      intervalInDays: 1,
      name: 'Test',
      estimate: 1,
      confidence: 3,
      impact: 1,
    };
    expect(getPrioScore(item)).toBe(0.1);
  });

  it('should return the correct score', () => {
    const item: TodoListItem = {
      id: '1',
      todo_list_id: '1',
      created: new Date(),
      updated: new Date(),
      intervalInDays: 1,
      name: 'Test',
      estimate: 1,
      confidence: 1,
      impact: 3,
    };
    expect(getPrioScore(item)).toBe(0.1);
  });

  it('should return the correct score for completed item', () => {
    const item: TodoListItem = {
      id: '1',
      todo_list_id: '1',
      created: new Date(),
      updated: new Date(),
      intervalInDays: 1,
      name: 'Test',
      estimate: 1,
      confidence: 1,
      impact: 3,
      completed: new Date(Date.now() - 1000),
    };
    expect(getPrioScore(item)).toBe(-2);
  });

  it('should return the correct score for upcoming item', () => {
    const item: TodoListItem = {
      id: '1',
      todo_list_id: '1',
      created: new Date(),
      updated: new Date(),
      intervalInDays: 1,
      name: 'Test',
      estimate: 1,
      confidence: 1,
      impact: 3,
      startDate: new Date(Date.now() + 1000),
    };
    expect(getPrioScore(item)).toBe(-1);
  });

  it('should return the correct score with missing estimate', () => {
    const item: TodoListItem = {
      id: '1',
      todo_list_id: '1',
      created: new Date(),
      updated: new Date(),
      intervalInDays: 1,
      name: 'Test',
      estimate: 0,
      confidence: 3,
      impact: 1,
    };
    expect(getPrioScore(item)).toBe(0.1);
  });

  it('should return the correct score with missing confidence', () => {
    const item: TodoListItem = {
      id: '1',
      todo_list_id: '1',
      created: new Date(),
      updated: new Date(),
      intervalInDays: 1,
      name: 'Test',
      estimate: 1,
      confidence: 0,
      impact: 1,
    };
    expect(getPrioScore(item)).toBe(2.6666666666666665);
  });

  it('should return the correct score with missing impact', () => {
    const item: TodoListItem = {
      id: '1',
      todo_list_id: '1',
      created: new Date(),
      updated: new Date(),
      intervalInDays: 1,
      name: 'Test',
      estimate: 1,
      confidence: 3,
      impact: 0,
    };
    expect(getPrioScore(item)).toBe(0.2);
  });
});

describe('getDaysRemaining', () => {
  it('should return the correct days remaining', () => {
    expect(getDaysRemaining(new Date(Date.now() + 1000))).toBe(1);
  });

  it('should return null if no date is provided', () => {
    expect(getDaysRemaining(undefined)).toBeNull();
    expect(getDaysRemaining(null)).toBeNull();
  });
});

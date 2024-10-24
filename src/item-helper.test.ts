import { isTaskRefined } from './item-helper';
import { TodoListItem } from './types/todo-list-item';

describe('isTaskRefined', () => {
  it('should return true if both estimate and impact are present', () => {
    const task: TodoListItem = {
      id: '1',
      created: new Date(),
      updated: new Date(),
      name: 'Task 1',
      estimate: 5,
      impact: 3,
      todo_list_id: 'list1',
      confidence: 0.8,
      intervalInDays: 7,
    };
    expect(isTaskRefined(task)).toBe(true);
  });

  it('should return false if estimate is missing', () => {
    const task: TodoListItem = {
      id: '2',
      created: new Date(),
      updated: new Date(),
      name: 'Task 2',
      impact: 3,
      todo_list_id: 'list1',
      confidence: 0.8,
      intervalInDays: 7,
      estimate: 0,
    };
    expect(isTaskRefined(task)).toBe(false);
  });

  it('should return false if impact is missing', () => {
    const task: TodoListItem = {
      id: '3',
      created: new Date(),
      updated: new Date(),
      name: 'Task 3',
      estimate: 5,
      todo_list_id: 'list1',
      confidence: 0.8,
      intervalInDays: 7,
      impact: 0,
    };
    expect(isTaskRefined(task)).toBe(false);
  });

  it('should return false if both estimate and impact are missing', () => {
    const task: TodoListItem = {
      id: '4',
      created: new Date(),
      updated: new Date(),
      name: 'Task 4',
      todo_list_id: 'list1',
      confidence: 0.8,
      intervalInDays: 7,
      estimate: 0,
      impact: 0,
    };
    expect(isTaskRefined(task)).toBe(false);
  });
});

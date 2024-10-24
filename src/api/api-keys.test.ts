import { GET_TODO_LIST_ITEMS, GET_TODO_LISTS, HEALTH_CHECK } from './api-keys';

describe('API Keys', () => {
  test('GET_TODO_LIST_ITEMS should return the correct array', () => {
    const todoListId = '123';
    const result = GET_TODO_LIST_ITEMS(todoListId);
    expect(result).toEqual(['GET_TODO_LIST_ITEMS', todoListId]);
  });

  test('GET_TODO_LISTS should return the correct array', () => {
    const result = GET_TODO_LISTS();
    expect(result).toEqual(['GET_TODO_LISTS']);
  });

  test('HEALTH_CHECK should return the correct array', () => {
    const result = HEALTH_CHECK();
    expect(result).toEqual(['HEALTH_CHECK']);
  });
});

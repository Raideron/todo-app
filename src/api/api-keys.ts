export const GET_TODO_LISTS = () => ['GET_TODO_LISTS'] as const;
export const GET_TODO_LIST_ITEMS = (todoListId: string) => ['GET_TODO_LIST_ITEMS', todoListId] as const;

'use client';

import { useQuery } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { GET_TODO_LIST_ITEMS } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { TodoListItem, TodoListItemSchema } from '@/types/todo-list-item';

export const useGetTodoListItems = (todoListId: string) => {
  const findingQuery = useQuery({
    queryKey: GET_TODO_LIST_ITEMS(todoListId),
    queryFn: async ({ signal }) => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const result = await pb.collection('todo_list_items').getFullList({
        signal,
        filter: `todo_list_id = "${todoListId}"`,
      });

      const items = result.map<TodoListItem>((item) => TodoListItemSchema.parse(item));

      return items;
    },
    enabled: !!todoListId,
  });

  return findingQuery;
};

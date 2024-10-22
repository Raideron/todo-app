'use client';

import { useQuery } from '@tanstack/react-query';

import { GET_TODO_LIST_ITEMS } from '@/api/api-keys';
import { pb } from '@/pocketbase';
import { TodoListItemSchema } from '@/types/todo-list-item';

export const useGetTodoListItems = (todoListId: string) => {
  const findingQuery = useQuery({
    queryKey: GET_TODO_LIST_ITEMS(todoListId),
    queryFn: async ({ signal }) => {
      const result = await pb.collection('todo_list_items').getFullList({
        signal,
        filter: `todo_list_id = "${todoListId}"`,
      });

      try {
        const items = await TodoListItemSchema.array().parseAsync(result);
        return items;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return [];
      }
    },
    enabled: !!todoListId,
    refetchInterval: 1000 * 60 * 5,
    staleTime: 1000,
  });

  return findingQuery;
};

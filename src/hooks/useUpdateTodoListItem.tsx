import { useMutation, useQueryClient } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { GET_TODO_LIST_ITEMS } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { TodoListItem } from '@/types/todo-list-item';

export const useUpdateTodoListItem = (todoListItemId: string) => {
  const queryClient = useQueryClient();

  const updateTodoListItemMutation = useMutation({
    mutationFn: async (todoListItem: TodoListItem) => {
      const pb = new PocketBase(POCKET_BASE_URL);
      await pb.collection('todo_list_items').update(todoListItem.id, todoListItem);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: GET_TODO_LIST_ITEMS(todoListItemId),
      });
    },
    onMutate: async (updatedFinding) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      queryClient.cancelQueries({ queryKey: GET_TODO_LIST_ITEMS(todoListItemId) });

      // Optimistically update to the new value
      queryClient.setQueryData<TodoListItem[]>(GET_TODO_LIST_ITEMS(todoListItemId), (oldItems) =>
        oldItems?.map((item) => {
          if (item.id === todoListItemId) {
            return updatedFinding;
          }

          return item;
        }),
      );
    },
  });

  return updateTodoListItemMutation;
};

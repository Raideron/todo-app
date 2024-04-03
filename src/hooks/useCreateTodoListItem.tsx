import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GET_TODO_LIST_ITEMS } from '@/api/api-keys';
import { pb } from '@/pocketbase';
import { TodoListItem, TodoListItemSchema } from '@/types/todo-list-item';

export const useCreateTodoListItem = (todoListItemId: string) => {
  const queryClient = useQueryClient();

  const updateTodoListItemMutation = useMutation({
    mutationFn: async (todoListItem: TodoListItem) => {
      const result = await pb.collection('todo_list_items').create(todoListItem);
      return TodoListItemSchema.parse(result);
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

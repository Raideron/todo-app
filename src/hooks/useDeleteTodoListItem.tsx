import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GET_TODO_LIST_ITEMS } from '@/api/api-keys';
import { pb } from '@/pocketbase';
import { TodoListItem } from '@/types/todo-list-item';

export const useDeleteTodoListItem = () => {
  const queryClient = useQueryClient();

  const updateTodoListItemMutation = useMutation({
    mutationFn: async (todoListItem: TodoListItem) => {
      await pb.collection('todo_list_items').delete(todoListItem.id);
    },
    onSettled: async (todoListItem, error, todoListItemInput) => {
      queryClient.invalidateQueries({
        queryKey: GET_TODO_LIST_ITEMS(todoListItemInput.todo_list_id),
      });
    },
    onMutate: async (todoListItemInput) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      queryClient.cancelQueries({ queryKey: GET_TODO_LIST_ITEMS(todoListItemInput.todo_list_id) });

      // Optimistically update to the new value
      queryClient.setQueryData<TodoListItem[]>(GET_TODO_LIST_ITEMS(todoListItemInput.todo_list_id), (oldItems) =>
        oldItems?.filter((item) => item.id !== todoListItemInput.todo_list_id),
      );
    },
  });

  return updateTodoListItemMutation;
};

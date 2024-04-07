import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GET_TODO_LISTS } from '@/api/api-keys';
import { pb } from '@/pocketbase';
import { TodoListSchema } from '@/types/todo-list';

export const useCreateTodoList = () => {
  const queryClient = useQueryClient();

  const createTodoListMutation = useMutation({
    mutationFn: async () => {
      const result = await pb.collection('todo_lists').create({ name: 'My Todo List' });
      return TodoListSchema.parse(result);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: GET_TODO_LISTS(),
      });
    },
    onMutate: async () => {
      queryClient.cancelQueries({ queryKey: GET_TODO_LISTS() });
    },
  });

  return createTodoListMutation;
};

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GET_TODO_LISTS } from '@/api/api-keys';
import { pb } from '@/pocketbase';
import { TodoList, TodoListSchema } from '@/types/todo-list';

export const useUpdateTodoList = () => {
  const queryClient = useQueryClient();

  const updateTodoListMutation = useMutation({
    mutationFn: async (todoList: TodoList) => {
      const result = await pb.collection('todo_lists').update(todoList.id, todoList);
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

  return updateTodoListMutation;
};

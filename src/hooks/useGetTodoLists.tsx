'use client';

import { useQuery } from '@tanstack/react-query';

import { GET_TODO_LISTS } from '@/api/api-keys';
import { pb } from '@/pocketbase';
import { TodoList, TodoListSchema } from '@/types/todo-list';

export const useGetTodoLists = () => {
  const findingQuery = useQuery({
    queryKey: GET_TODO_LISTS(),
    queryFn: async ({ signal }) => {
      const result = await pb.collection('todo_lists').getFullList({
        signal,
      });
      const lists = result.map<TodoList>((list) => TodoListSchema.parse(list));
      return lists;
    },
    refetchInterval: 1000 * 60 * 5,
  });

  return findingQuery;
};

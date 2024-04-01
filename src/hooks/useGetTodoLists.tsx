import { useQuery } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { GET_TODO_LISTS } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { TodoList, TodoListSchema } from '@/types/todo-list';

export const useGetTodoLists = () => {
  const findingQuery = useQuery({
    queryKey: GET_TODO_LISTS(),
    queryFn: async ({ signal }) => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const result = await pb.collection('todo_lists').getFullList({
        signal,
      });
      const lists = result.map<TodoList>((list) => TodoListSchema.parse(list));
      return lists;
    },
  });

  return findingQuery;
};

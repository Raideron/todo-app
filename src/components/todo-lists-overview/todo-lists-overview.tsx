import React from 'react';

import { useGetTodoLists } from '@/hooks/useGetTodoLists';

interface TodoListsOverviewProps {}

export const TodoListsOverview: React.FC<TodoListsOverviewProps> = (props) => {
  console.log('TodoListsOverview', props);
  const todoListsQuery = useGetTodoLists();

  return (
    <>
      <h1>TodoListsOverview</h1>
      <ul>{todoListsQuery.data?.map((list) => <li key={list.id}>{list.name}</li>)}</ul>
    </>
  );
};

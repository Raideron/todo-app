'use client';

import React from 'react';

import { useGetTodoLists } from '@/hooks/useGetTodoLists';

export const TodoListsOverview: React.FC = () => {
  const todoListsQuery = useGetTodoLists();

  return (
    <>
      <h1>TodoListsOverview</h1>
      <ul>{todoListsQuery.data?.map((list) => <li key={list.id}>{list.name}</li>)}</ul>
    </>
  );
};

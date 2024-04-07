'use client';

import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader } from 'react-bootstrap';

import { useCreateTodoList } from '@/hooks/useCreateTodoList';
import { useGetTodoLists } from '@/hooks/useGetTodoLists';

import { TodoListComp } from './todo-list';

export const TodoListsOverview: React.FC = () => {
  const todoListsQuery = useGetTodoLists();
  const createTodoListMutation = useCreateTodoList();

  useEffect(() => {
    if (todoListsQuery.data?.length === 0) {
      createTodoListMutation.mutate();
    }
  }, [todoListsQuery.data]);

  return (
    <>
      {todoListsQuery.data?.map((list) => (
        <Card key={list.id}>
          <CardHeader>
            <h3>{list.name}</h3>
          </CardHeader>

          <CardBody className='p-0'>
            <TodoListComp todoList={list} />
          </CardBody>
        </Card>
      ))}
    </>
  );
};

'use client';

import React from 'react';
import { Card, CardBody, CardHeader } from 'react-bootstrap';

import { useGetTodoLists } from '@/hooks/useGetTodoLists';

import { TodoListComp } from './todo-list';

export const TodoListsOverview: React.FC = () => {
  const todoListsQuery = useGetTodoLists();

  return (
    <>
      <h1>TodoListsOverview</h1>
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

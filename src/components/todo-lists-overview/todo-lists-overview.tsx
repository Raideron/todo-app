'use client';

import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Dropdown, Form } from 'react-bootstrap';

import { useCreateTodoList } from '@/hooks/useCreateTodoList';
import { useGetTodoLists } from '@/hooks/useGetTodoLists';
import { useUpdateTodoList } from '@/hooks/useUpdateTodoList';

import { TodoListComp } from './todo-list';

export const TodoListsOverview: React.FC = () => {
  const todoListsQuery = useGetTodoLists();
  const createTodoListMutation = useCreateTodoList();
  const updateTodoListMutation = useUpdateTodoList();

  const [isEditingName, setIsEditingName] = useState(false);
  const [openedListId, setOpenedListId] = useState<string | null>(null);
  const openedList = todoListsQuery.data?.find((list) => list.id === openedListId);

  useEffect(() => {
    const firstList = _.first(todoListsQuery.data);
    if (firstList) {
      setOpenedListId(firstList.id);
    }
  }, [todoListsQuery.data]);

  useEffect(() => {
    if (todoListsQuery.data?.length === 0) {
      createTodoListMutation.mutate();
    }
  }, [todoListsQuery.data]);

  if (!openedList) {
    return null;
  }

  return (
    <Card>
      <CardHeader className='d-flex align-items-center'>
        {isEditingName ? (
          <Form.Control
            value={openedList.name}
            onChange={(e) => updateTodoListMutation.mutate({ ...openedList, name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditingName(false);
              }
            }}
            autoFocus
          />
        ) : (
          <h3 className='d-inline-block me-3' onClick={() => setIsEditingName(true)}>
            {openedList.name}
          </h3>
        )}

        <Dropdown className='d-inline-block'>
          <Dropdown.Toggle variant='outline-secondary'>Select list</Dropdown.Toggle>

          <Dropdown.Menu>
            {todoListsQuery.data?.map((list) => (
              <Dropdown.Item key={list.id} onClick={() => setOpenedListId(list.id)}>
                {list.name}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => createTodoListMutation.mutate()}>Create new list</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </CardHeader>

      <CardBody className='p-0'>
        <TodoListComp todoList={openedList} />
      </CardBody>
    </Card>
  );
};

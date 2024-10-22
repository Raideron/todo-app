'use client';

import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Col, Dropdown, Form, Row } from 'react-bootstrap';

import { useCreateTodoList } from '@/hooks/useCreateTodoList';
import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { useGetTodoLists } from '@/hooks/useGetTodoLists';
import { useUpdateTodoList } from '@/hooks/useUpdateTodoList';
import { TodoList } from '@/types/todo-list';
import { TodoListItem } from '@/types/todo-list-item';

import { TodoListComp } from './todo-list';

export const TodoListsOverview: React.FC = () => {
  const todoListsQuery = useGetTodoLists();
  const createTodoListMutation = useCreateTodoList();
  const updateTodoListMutation = useUpdateTodoList();

  const [isEditingName, setIsEditingName] = useState(false);
  const orderedTodoLists = _.orderBy(todoListsQuery.data, (x) => x.last_opened ?? x.updated, 'desc');
  const openedList = _.first(orderedTodoLists);

  const todoListItemsQuery = useGetTodoListItems(openedList?.id ?? '');

  useEffect(() => {
    if (todoListsQuery.data?.length === 0) {
      createTodoListMutation.mutate();
    }
  }, [todoListsQuery.data]);

  const setOpenedList = (list: TodoList) => {
    updateTodoListMutation.mutate({ ...list, last_opened: new Date() });
  };

  if (!openedList) {
    return null;
  }

  const sortedLists = _.orderBy(todoListsQuery.data, (x) => x.last_opened ?? x.updated, 'desc');
  const previousList = _.get(sortedLists, 1);

  const isTaskSnoozed = (task: TodoListItem) => task.startDate && task.startDate > new Date();
  const todoCount = todoListItemsQuery.data?.filter((x) => !x.completed && !isTaskSnoozed(x)).length;
  const snoozeCount = todoListItemsQuery.data?.filter((x) => !x.completed && isTaskSnoozed(x)).length;
  const completedCount = todoListItemsQuery.data?.filter((x) => x.completed).length;

  return (
    <Card className='mb-5'>
      <CardHeader className='d-flex align-items-center'>
        <Row className='gap-2'>
          <Col sm={'auto'} xs={6}>
            <Row className='g-0'>
              <Col xs='auto'>
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
                  <h3 className='d-inline-block me-2 mb-1' onClick={() => setIsEditingName(true)}>
                    {openedList.name}
                  </h3>
                )}
              </Col>

              <Col xs='auto'>
                <Badge bg='secondary' className='me-3 mb-0' pill style={{ fontSize: '1.25rem' }}>
                  {`${todoCount} / ${snoozeCount} / ${completedCount}`}
                </Badge>
              </Col>
            </Row>
          </Col>

          <Col sm={'auto'} xs={'auto'}>
            <Dropdown className='d-inline-block' as={ButtonGroup}>
              <Button variant='outline-secondary' onClick={() => setOpenedList(previousList)}>
                Switch list
              </Button>

              <Dropdown.Toggle split variant='outline-secondary' />

              <Dropdown.Menu>
                {sortedLists.map((list) => (
                  <Dropdown.Item key={list.id} onClick={() => setOpenedList(list)}>
                    {list.name}
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => createTodoListMutation.mutate()}>Create new list</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </CardHeader>

      <CardBody className='p-0'>
        <TodoListComp todoList={openedList} />
      </CardBody>
    </Card>
  );
};

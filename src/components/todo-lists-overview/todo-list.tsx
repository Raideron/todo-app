'use client';

import React from 'react';
import { Table } from 'react-bootstrap';

import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { useUpdateTodoListItem } from '@/hooks/useUpdateTodoListItem';
import { TodoList } from '@/types/todo-list';

import { EditableCell } from '../editable-cell';

interface TodoListCompProps {
  todoList: TodoList;
}

export const TodoListComp: React.FC<TodoListCompProps> = (props) => {
  const todoListItemsQuery = useGetTodoListItems(props.todoList.id);
  const todoListItemMutation = useUpdateTodoListItem(props.todoList.id);

  return (
    <div>
      <Table striped bordered hover className='m-0'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Estimate</th>
            <th>Impact</th>
          </tr>
        </thead>

        <tbody>
          {todoListItemsQuery.data?.map((item) => (
            <tr key={item.id}>
              <EditableCell
                value={item.name}
                type='text'
                onChange={(value) => todoListItemMutation.mutate({ ...item, name: value })}
              />

              <EditableCell
                value={item.description ?? null}
                type='text'
                onChange={(value) => todoListItemMutation.mutate({ ...item, description: value })}
              />

              <EditableCell
                value={item.deadline ?? null}
                type='date'
                onChange={(value) => todoListItemMutation.mutate({ ...item, deadline: new Date(value) })}
              />

              <EditableCell
                value={item.estimate ?? null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, estimate: parseFloat(value) })}
              />

              <EditableCell
                value={item.impact ?? null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, impact: parseFloat(value) })}
              />
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

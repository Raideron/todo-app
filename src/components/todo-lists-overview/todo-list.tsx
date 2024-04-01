'use client';

import React from 'react';
import { Table } from 'react-bootstrap';

import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { useUpdateTodoListItem } from '@/hooks/useUpdateTodoListItem';
import { TodoList } from '@/types/todo-list';

import { EditableField } from '../editable-field';

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
              <td>
                <EditableField
                  value={item.name}
                  type='text'
                  onChange={(value) => todoListItemMutation.mutate({ ...item, name: value })}
                ></EditableField>
              </td>
              <td>
                <EditableField
                  value={item.description ?? null}
                  type='text'
                  onChange={(value) => todoListItemMutation.mutate({ ...item, description: value })}
                ></EditableField>
              </td>
              <td>
                <EditableField
                  value={item.deadline ?? null}
                  type='date'
                  onChange={(value) => todoListItemMutation.mutate({ ...item, deadline: new Date(value) })}
                ></EditableField>
              </td>
              <td>
                <EditableField
                  value={item.estimate ?? null}
                  type='number'
                  onChange={(value) => todoListItemMutation.mutate({ ...item, estimate: parseFloat(value) })}
                ></EditableField>
              </td>
              <td>
                <EditableField
                  value={item.impact ?? null}
                  type='number'
                  onChange={(value) => todoListItemMutation.mutate({ ...item, impact: parseFloat(value) })}
                ></EditableField>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

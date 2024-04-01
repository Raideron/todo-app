'use client';

import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';

import { useCreateTodoListItem } from '@/hooks/useCreateTodoListItem';
import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { useUpdateTodoListItem } from '@/hooks/useUpdateTodoListItem';
import { TodoList } from '@/types/todo-list';
import { TodoListItem } from '@/types/todo-list-item';

import { EditableCell } from '../editable-cell';

interface TodoListCompProps {
  todoList: TodoList;
}

export const TodoListComp: React.FC<TodoListCompProps> = (props) => {
  const todoListItemsQuery = useGetTodoListItems(props.todoList.id);
  const todoListItemMutation = useUpdateTodoListItem(props.todoList.id);
  const todoListItemCreationMutation = useCreateTodoListItem(props.todoList.id);

  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TodoListItem } | null>(null);

  const getPrioScore = (item: TodoListItem): number => {
    const estimate = item.estimate ?? 0;
    const impact = item.impact ?? 0;

    return impact / (estimate + 1);
  };

  const sortedListWithEmptyRow: TodoListItem[] = _.orderBy(todoListItemsQuery.data, getPrioScore, 'desc');

  const newTodoListItem: TodoListItem = {
    id: '',
    created: new Date(),
    updated: new Date(),
    name: '',
    todo_list_id: props.todoList.id,
  };

  const handleCreateTodoListItem = async () => {
    await todoListItemCreationMutation.mutateAsync(newTodoListItem);
    setEditingCell({ id: newTodoListItem.id, field: 'name' });
  };

  return (
    <div>
      <Table striped bordered hover className='m-0'>
        <thead onClick={() => setEditingCell(null)}>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Estimate</th>
            <th>Impact</th>
            <th>Prio Score</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={6}>
              <Button onClick={handleCreateTodoListItem} variant='primary'>
                Add new item
              </Button>
            </td>
          </tr>

          {sortedListWithEmptyRow.map((item) => (
            <tr key={item.id}>
              <EditableCell
                value={item.name}
                type='text'
                onChange={(value) => todoListItemMutation.mutate({ ...item, name: value })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'name'}
                onClick={() => setEditingCell({ id: item.id, field: 'name' })}
                onEnter={() => setEditingCell(null)}
              />

              <EditableCell
                value={item.description ?? null}
                type='text'
                onChange={(value) => todoListItemMutation.mutate({ ...item, description: value })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'description'}
                onClick={() => setEditingCell({ id: item.id, field: 'description' })}
                onEnter={() => setEditingCell(null)}
              />

              <EditableCell
                value={item.deadline ?? null}
                type='date'
                onChange={(value) => todoListItemMutation.mutate({ ...item, deadline: new Date(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'deadline'}
                onClick={() => setEditingCell({ id: item.id, field: 'deadline' })}
                onEnter={() => setEditingCell(null)}
              />

              <EditableCell
                value={item.estimate ?? null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, estimate: parseFloat(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'estimate'}
                onClick={() => setEditingCell({ id: item.id, field: 'estimate' })}
                onEnter={() => setEditingCell(null)}
              />

              <EditableCell
                value={item.impact ?? null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, impact: parseFloat(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'impact'}
                onClick={() => setEditingCell({ id: item.id, field: 'impact' })}
                onEnter={() => setEditingCell(null)}
              />

              <td>{getPrioScore(item)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

'use client';

import _ from 'lodash';
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

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

  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TodoListItem } | null>(null);

  const getPrioScore = (item: TodoListItem): number => {
    const estimate = item.estimate ?? 0;
    const impact = item.impact ?? 0;

    return impact / estimate;
  };

  const sortedListWithEmptyRow: TodoListItem[] = _.orderBy(todoListItemsQuery.data, getPrioScore, 'desc');

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
            <td colSpan={6}>Empty row</td>
          </tr>

          {sortedListWithEmptyRow.map((item) => (
            <tr key={item.id}>
              <EditableCell
                value={item.name}
                type='text'
                onChange={(value) => todoListItemMutation.mutate({ ...item, name: value })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'name'}
                onClick={() => setEditingCell({ id: item.id, field: 'name' })}
              />

              <EditableCell
                value={item.description ?? null}
                type='text'
                onChange={(value) => todoListItemMutation.mutate({ ...item, description: value })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'description'}
                onClick={() => setEditingCell({ id: item.id, field: 'description' })}
              />

              <EditableCell
                value={item.deadline ?? null}
                type='date'
                onChange={(value) => todoListItemMutation.mutate({ ...item, deadline: new Date(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'deadline'}
                onClick={() => setEditingCell({ id: item.id, field: 'deadline' })}
              />

              <EditableCell
                value={item.estimate ?? null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, estimate: parseFloat(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'estimate'}
                onClick={() => setEditingCell({ id: item.id, field: 'estimate' })}
              />

              <EditableCell
                value={item.impact ?? null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, impact: parseFloat(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'impact'}
                onClick={() => setEditingCell({ id: item.id, field: 'impact' })}
              />

              <td>{getPrioScore(item)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

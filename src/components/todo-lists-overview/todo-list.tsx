'use client';

import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

import { getPrioScore } from '@/get-prio-score';
import { useCreateTodoListItem } from '@/hooks/useCreateTodoListItem';
import { useDeleteTodoListItem } from '@/hooks/useDeleteTodoListItem';
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
  const todoListItemMutation = useUpdateTodoListItem();
  const todoListItemCreationMutation = useCreateTodoListItem();
  const todoListItemDeletionMutation = useDeleteTodoListItem();

  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TodoListItem } | null>(null);

  const sortedListWithEmptyRow: TodoListItem[] = _.orderBy(todoListItemsQuery.data, getPrioScore, 'desc');

  const newTodoListItem: TodoListItem = {
    id: '',
    created: new Date(),
    updated: new Date(),
    name: '',
    todo_list_id: props.todoList.id,
    isCompleted: false,
    estimate: 0,
    impact: 0,
    confidence: 0,
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
            <th />
            <th>Name</th>
            <th>Description</th>
            <th>Estimate</th>
            <th>Impact</th>
            <th>Deadline</th>
            <th>Confidence</th>
            <th>Prio Score</th>
            <th />
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={8}>
              <Button onClick={handleCreateTodoListItem} variant='primary'>
                Add new item
              </Button>
            </td>
          </tr>

          {sortedListWithEmptyRow.map((item) => (
            <tr key={item.id}>
              <td>
                <div className='d-flex align-items-center h-100'>
                  <Form.Check
                    className='d-inline-block'
                    type='checkbox'
                    checked={item.isCompleted}
                    onChange={(e) => todoListItemMutation.mutate({ ...item, isCompleted: e.target.checked })}
                  />
                </div>
              </td>

              <EditableCell
                value={item.name}
                type='text'
                onChange={(value) => todoListItemMutation.mutate({ ...item, name: value })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'name'}
                onClick={() => setEditingCell({ id: item.id, field: 'name' })}
                onEnter={() => setEditingCell(null)}
                isComplete={item.isCompleted}
              />

              <EditableCell
                value={item.description ?? null}
                type='text'
                onChange={(value) => todoListItemMutation.mutate({ ...item, description: value })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'description'}
                onClick={() => setEditingCell({ id: item.id, field: 'description' })}
                onEnter={() => setEditingCell(null)}
                isComplete={item.isCompleted}
              />

              <EditableCell
                value={item.estimate || null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, estimate: parseFloat(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'estimate'}
                onClick={() => setEditingCell({ id: item.id, field: 'estimate' })}
                onEnter={() => setEditingCell(null)}
                isComplete={item.isCompleted}
              />

              <EditableCell
                value={item.impact || null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, impact: parseFloat(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'impact'}
                onClick={() => setEditingCell({ id: item.id, field: 'impact' })}
                onEnter={() => setEditingCell(null)}
                isComplete={item.isCompleted}
              />

              <EditableCell
                value={item.deadline ?? null}
                type='date'
                onChange={(value) => todoListItemMutation.mutate({ ...item, deadline: new Date(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'deadline'}
                onClick={() => setEditingCell({ id: item.id, field: 'deadline' })}
                onEnter={() => setEditingCell(null)}
                isComplete={item.isCompleted}
              />

              <EditableCell
                value={item.confidence || null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, confidence: parseFloat(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'confidence'}
                onClick={() => setEditingCell({ id: item.id, field: 'confidence' })}
                onEnter={() => setEditingCell(null)}
                isComplete={item.isCompleted}
              />

              <td style={{ textDecorationLine: item.isCompleted ? 'line-through' : undefined }}>
                {Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(getPrioScore(item))}
              </td>

              <td>
                <Button
                  variant='outline-danger'
                  size='sm'
                  className='ms-2'
                  onClick={() => todoListItemDeletionMutation.mutate(item)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

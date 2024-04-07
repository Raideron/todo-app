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

import { EditTodoItemModal } from '../edit-item';
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
  const [openedItem, setOpenedItem] = useState<TodoListItem | null>(null);
  const [refineList, setRefineList] = useState<string[]>([]);

  const sortedListWithEmptyRow: TodoListItem[] = _.orderBy(todoListItemsQuery.data, getPrioScore, 'desc');

  const handleCreateTodoListItem = async () => {
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

    setOpenedItem(newTodoListItem);
  };

  const handleModalSave = async () => {
    if (!openedItem) {
      return;
    }

    if (!openedItem.id) {
      await todoListItemCreationMutation.mutateAsync(openedItem);
    } else {
      await todoListItemMutation.mutateAsync(openedItem);
    }

    if (refineList.length > 0) {
      continueRefining(refineList);
    } else {
      setOpenedItem(null);
    }
  };

  const getRefinementList = () =>
    todoListItemsQuery.data?.filter((item) => !item.isCompleted).filter((item) => !item.estimate || !item.impact) ?? [];

  const startRefining = () => {
    const itemsToRefine = getRefinementList();
    const itemIdsToRefine = itemsToRefine.map((item) => item.id);
    setRefineList(itemIdsToRefine);
    continueRefining(itemIdsToRefine);
  };

  const continueRefining = (itemIdsToRefine: string[]) => {
    const itemIdToRefine = _.first(itemIdsToRefine);
    const itemToRefine = todoListItemsQuery.data?.find((item) => item.id === itemIdToRefine) ?? null;
    setOpenedItem(itemToRefine);
    setRefineList(_.tail(itemIdsToRefine));
  };

  return (
    <div>
      <div className='d-flex p-2 gap-2'>
        <Button onClick={handleCreateTodoListItem} variant='primary'>
          Add new item
        </Button>

        <Button
          onClick={startRefining}
          variant={getRefinementList().length ? 'outline-primary' : 'outline-secondary'}
          disabled={!getRefinementList().length}
        >
          Refine list
        </Button>
      </div>
      <Table striped bordered hover className='m-0' responsive>
        <thead onClick={() => setEditingCell(null)}>
          <tr>
            <th />
            <th>Name</th>
            <th>Description</th>
            <th>Estimate</th>
            <th>Impact</th>
            <th>Deadline</th>
            <th>Prio Score</th>
            <th />
          </tr>
        </thead>

        <tbody>
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

      <EditTodoItemModal
        localItem={openedItem}
        onChange={(partialItem) =>
          setOpenedItem((oldItem) => {
            if (!oldItem) {
              return oldItem;
            }
            return { ...oldItem, ...partialItem };
          })
        }
        onSave={() => handleModalSave()}
        onClose={() => setOpenedItem(null)}
      />
    </div>
  );
};

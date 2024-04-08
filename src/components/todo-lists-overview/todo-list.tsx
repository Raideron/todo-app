'use client';

import _ from 'lodash';
import React, { useState } from 'react';
import { Button, ButtonGroup, Form, Table } from 'react-bootstrap';
import { BsPencil, BsPlusLg, BsTrash } from 'react-icons/bs';
import { z } from 'zod';

import { getPrioScore } from '@/get-prio-score';
import { useCreateTodoListItem } from '@/hooks/useCreateTodoListItem';
import { useDeleteTodoListItem } from '@/hooks/useDeleteTodoListItem';
import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { useUpdateTodoListItem } from '@/hooks/useUpdateTodoListItem';
import { TodoList } from '@/types/todo-list';
import { TodoListItem, TodoListItemSchema } from '@/types/todo-list-item';

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

  const [searchText, setSearchText] = useState('');
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TodoListItem } | null>(null);
  const [openedItem, setOpenedItem] = useState<TodoListItem | null>(null);
  const [refineList, setRefineList] = useState<string[]>([]);

  const filteredList =
    todoListItemsQuery.data?.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase())) ?? [];
  const sortedList: TodoListItem[] = _.orderBy(filteredList, getPrioScore, 'desc');

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

  const handleExport = () => {
    // export as json file
    const filename = `${props.todoList.name}.json`;

    const itemsToExport = todoListItemsQuery.data;

    if (!itemsToExport) {
      return;
    }

    const json = JSON.stringify(itemsToExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }

      const text = await file.text();
      const items = z.array(TodoListItemSchema).parse(JSON.parse(text));
      items.forEach((item) => {
        item.todo_list_id = props.todoList.id;
      });

      await Promise.all(items.map((item) => todoListItemCreationMutation.mutateAsync(item)));
    };

    input.click();
  };

  return (
    <div>
      <div className='d-flex p-2 gap-2 flex-wrap'>
        <Button onClick={handleCreateTodoListItem} variant='primary' className='d-flex text-nowrap align-items-center'>
          <BsPlusLg className='me-1' />
          New task
        </Button>

        <Button
          onClick={startRefining}
          variant={getRefinementList().length ? 'outline-primary' : 'outline-secondary'}
          disabled={!getRefinementList().length}
          className='text-nowrap'
        >
          Refine list
        </Button>

        <Form.Control
          className='d-flex'
          style={{ width: 'auto' }}
          type='search'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder='Search'
        />

        <ButtonGroup className='d-flex'>
          <Button onClick={handleExport} variant='outline-secondary' className='text-nowrap'>
            Export list
          </Button>
          <Button onClick={handleImport} variant='outline-secondary' className='text-nowrap'>
            Import list
          </Button>
        </ButtonGroup>
      </div>
      <Table striped borderless hover className='m-0' responsive>
        <thead onClick={() => setEditingCell(null)}>
          <tr>
            <th />
            <th>Name</th>
            <th>Estimate</th>
            <th>Impact</th>
            <th>Deadline</th>
            <th>Prio Score</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {sortedList.map((item) => (
            <tr key={item.id}>
              <td style={{ width: 1 }}>
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
                subText={item.description}
              />

              <EditableCell
                value={item.estimate || null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, estimate: parseFloat(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'estimate'}
                onClick={() => setEditingCell({ id: item.id, field: 'estimate' })}
                onEnter={() => setEditingCell(null)}
                isComplete={item.isCompleted}
                width={'5em'}
              />

              <EditableCell
                value={item.impact || null}
                type='number'
                onChange={(value) => todoListItemMutation.mutate({ ...item, impact: parseFloat(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'impact'}
                onClick={() => setEditingCell({ id: item.id, field: 'impact' })}
                onEnter={() => setEditingCell(null)}
                isComplete={item.isCompleted}
                width={'5em'}
              />

              <EditableCell
                value={item.deadline ?? null}
                type='date'
                onChange={(value) => todoListItemMutation.mutate({ ...item, deadline: new Date(value) })}
                isEditing={editingCell?.id === item.id && editingCell.field === 'deadline'}
                onClick={() => setEditingCell({ id: item.id, field: 'deadline' })}
                onEnter={() => setEditingCell(null)}
                isComplete={item.isCompleted}
                width={'12em'}
              />

              <td style={{ textDecorationLine: item.isCompleted ? 'line-through' : undefined, width: '6em' }}>
                {Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(getPrioScore(item))}
              </td>

              <td style={{ width: 1 }}>
                <ButtonGroup>
                  <Button variant='outline-primary' size='sm' onClick={() => setOpenedItem(item)}>
                    <BsPencil />
                  </Button>
                  <Button variant='outline-danger' size='sm' onClick={() => todoListItemDeletionMutation.mutate(item)}>
                    <BsTrash />
                  </Button>
                </ButtonGroup>
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

'use client';

import { useWindowSize } from '@react-hook/window-size';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, ButtonGroup, Form, Table } from 'react-bootstrap';
import { BsPencil, BsPlusLg, BsTrash } from 'react-icons/bs';
import { z } from 'zod';

import { getEstimateDisplayValue } from '@/estimate-display-value';
import { getPrioScore } from '@/get-prio-score';
import { useCreateTodoListItem } from '@/hooks/useCreateTodoListItem';
import { useDeleteTodoListItem } from '@/hooks/useDeleteTodoListItem';
import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { useUpdateTodoListItem } from '@/hooks/useUpdateTodoListItem';
import { isTaskRefined } from '@/item-helper';
import { TodoList } from '@/types/todo-list';
import { TodoListItem, TodoListItemSchema } from '@/types/todo-list-item';

import { EditTodoItemModal } from '../edit-item/edit-item';
import { EditableCell } from '../editable-cell';
import { SnoozeBtn } from '../snooze-btn';

interface TodoListCompProps {
  todoList: TodoList;
}

export const TodoListComp: React.FC<TodoListCompProps> = (props) => {
  const [windowWidth] = useWindowSize();
  const minWidthForExtraColumns = 1000;

  const todoListItemsQuery = useGetTodoListItems(props.todoList.id);
  const todoListItemMutation = useUpdateTodoListItem();
  const todoListItemCreationMutation = useCreateTodoListItem();
  const todoListItemDeletionMutation = useDeleteTodoListItem();

  const [searchText, setSearchText] = useState('');
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TodoListItem } | null>(null);
  const [openedItem, setOpenedItem] = useState<TodoListItem | null>(null);
  const [refineList, setRefineList] = useState<string[]>([]);

  const questStartSoundRef = useRef<HTMLAudioElement>(null);
  const questCompleteSoundRef = useRef<HTMLAudioElement>(null);

  const filteredList =
    todoListItemsQuery.data?.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(searchText.toLowerCase());
      if (matchesName) {
        return true;
      }

      const matchesDescription = item.description?.toLowerCase().includes(searchText.toLowerCase()) ?? false;
      if (matchesDescription) {
        return true;
      }

      return false;
    }) ?? [];
  const sortedList: TodoListItem[] = _.orderBy(filteredList, [getPrioScore, (x) => x.name], ['desc', 'asc']);

  useEffect(() => {
    setSearchText('');
  }, [props.todoList.id]);

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
    setOpenedItem(newTodoListItem);
  };

  const handleModalSaveBtn = async () => {
    if (!openedItem) {
      return;
    }

    const newI = newTodoListItem;
    newI.created = openedItem.created;
    newI.updated = openedItem.updated;
    if (_.isEqual(openedItem, newI)) {
      setOpenedItem(null);
      return;
    }

    startQuestSound();

    if (!openedItem.id) {
      todoListItemCreationMutation.mutateAsync(openedItem);
    } else {
      todoListItemMutation.mutateAsync(openedItem);
    }

    if (refineList.length > 0) {
      continueRefining(refineList);
    } else {
      setOpenedItem(null);
    }
  };

  const handleModalCloseBtn = () => {
    if (!openedItem) {
      return;
    }

    setOpenedItem(null);
    setRefineList([]);
  };

  /** Plays a sound when refining a new task */
  const startQuestSound = () => {
    const newItem = openedItem;
    const oldItem = todoListItemsQuery.data?.find((item) => item.id === newItem?.id) ?? undefined;

    if (!newItem) {
      return;
    }

    const isNewTask = !newItem.id;
    const isTaskNewlyRefined = !!oldItem && !isTaskRefined(oldItem) && isTaskRefined(newItem);

    if (isNewTask || isTaskNewlyRefined) {
      questStartSoundRef.current?.play();
    }
  };

  /** Plays a sound when a task is completed */
  const completeQuest = () => {
    questCompleteSoundRef.current?.play();
  };

  const getRefinementList = () =>
    todoListItemsQuery.data?.filter((item) => !item.isCompleted).filter((x) => !isTaskRefined(x)) ?? [];

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

  const deleteCompletedTasks = async () => {
    const completedTasks = todoListItemsQuery.data?.filter((item) => item.isCompleted) ?? [];
    await Promise.all(completedTasks.map((item) => todoListItemDeletionMutation.mutateAsync(item)));
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

  const handleNextPrev = (delta: -1 | 1) => {
    if (!openedItem) {
      return;
    }

    todoListItemMutation.mutateAsync(openedItem);

    const currentIndex = _.findIndex(sortedList, (item) => item.id === openedItem.id);
    const nextItem = _.nth(sortedList, currentIndex + delta);

    if (nextItem) {
      setOpenedItem(nextItem);
    }
  };

  return (
    <div>
      <audio ref={questStartSoundRef} preload='auto' src='/sounds/iQuestActivate.mp3' />
      <audio ref={questCompleteSoundRef} preload='auto' src='/sounds/iQuestComplete.mp3' />

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
          {getRefinementList().length > 0 && (
            <Badge bg='primary' className='ms-1' pill>
              {getRefinementList().length}
            </Badge>
          )}
        </Button>

        <Form.Control
          className='d-flex'
          style={{ width: 'auto' }}
          type='search'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder='Search'
        />

        <Button
          variant='outline-danger'
          className='d-flex align-items-center text-nowrap'
          onClick={deleteCompletedTasks}
        >
          <BsTrash className='me-1' />
          Delete all completed tasks
        </Button>

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
            {windowWidth > minWidthForExtraColumns && (
              <>
                <th>Impact</th>
                <th>Estimate</th>
                <th>Deadline</th>
                <th>Prio Score</th>
              </>
            )}
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
                    onChange={(e) => {
                      if (e.target.checked) {
                        completeQuest();
                      }

                      return todoListItemMutation.mutate({ ...item, isCompleted: e.target.checked });
                    }}
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

              {windowWidth > minWidthForExtraColumns && (
                <>
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
                    value={
                      editingCell?.id === item.id && editingCell.field === 'estimate'
                        ? item.estimate
                        : getEstimateDisplayValue(item.estimate, item.estimate < 1 ? 'm' : 'h')
                    }
                    type='number'
                    onChange={(value) => todoListItemMutation.mutate({ ...item, estimate: parseFloat(value) })}
                    isEditing={editingCell?.id === item.id && editingCell.field === 'estimate'}
                    onClick={() => setEditingCell({ id: item.id, field: 'estimate' })}
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
                </>
              )}

              <td style={{ width: 1 }}>
                <ButtonGroup>
                  <SnoozeBtn
                    task={item}
                    onSnooze={(newStartDate) => todoListItemMutation.mutate({ ...item, startDate: newStartDate })}
                  />
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
        onSave={handleModalSaveBtn}
        onClose={handleModalCloseBtn}
        onNextPrev={handleNextPrev}
      />
    </div>
  );
};

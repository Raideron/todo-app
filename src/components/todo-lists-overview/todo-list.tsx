'use client';

import { useWindowSize } from '@react-hook/window-size';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { BsGear, BsPlusLg } from 'react-icons/bs';
import { z } from 'zod';

import { getPrioScore } from '@/get-prio-score';
import { useCreateTodoListItem } from '@/hooks/useCreateTodoListItem';
import { useDeleteTodoListItem } from '@/hooks/useDeleteTodoListItem';
import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { useUpdateTodoListItem } from '@/hooks/useUpdateTodoListItem';
import { isTaskRefined } from '@/item-helper';
import { TodoList } from '@/types/todo-list';
import { TodoListItem, TodoListItemSchema } from '@/types/todo-list-item';

import { EditTodoItemModal } from '../edit-item/edit-item';
import { TodoListProgress } from './todo-list-progress';
import { TodoListTable } from './todo-list-table';

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
  const [openedItem, setOpenedItem] = useState<TodoListItem | null>(null);
  const [refineList, setRefineList] = useState<string[]>([]);

  const questStartSoundRef = useRef<HTMLAudioElement>(null);
  const questCompleteSoundRef = useRef<HTMLAudioElement>(null);
  const snoozeSoundRef = useRef<HTMLAudioElement>(null);

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
    intervalInDays: 0,
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
  const handleTaskCheck = (e: React.ChangeEvent<HTMLInputElement>, item: TodoListItem) => {
    if (e.target.checked) {
      questCompleteSoundRef.current?.play();

      if (item.intervalInDays > 0) {
        const newStartDate = new Date(new Date().setDate(new Date().getDate() + item.intervalInDays));
        const newItem: TodoListItem = {
          ...item,
          id: '',
          startDate: newStartDate,
          isCompleted: false,
        };
        todoListItemCreationMutation.mutateAsync(newItem);
      }
    }

    todoListItemMutation.mutate({ ...item, isCompleted: e.target.checked });
  };

  const handleSnoozeBtn = (task: TodoListItem, newStartDate: Date) => {
    todoListItemMutation.mutate({ ...task, startDate: newStartDate });
    snoozeSoundRef.current?.play();
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
      <audio ref={snoozeSoundRef} preload='auto' src='/sounds/SealOfMight.mp3' />

      <div className='d-flex p-2 gap-2 flex-wrap'>
        <Button
          onClick={handleCreateTodoListItem}
          variant='primary'
          className='d-flex text-nowrap align-items-center'
          style={{ height: 'fit-content' }}
        >
          <BsPlusLg className='me-1' />
          New task
        </Button>

        <Button
          onClick={startRefining}
          variant={getRefinementList().length ? 'outline-primary' : 'outline-secondary'}
          disabled={!getRefinementList().length}
          className='text-nowrap'
          style={{ height: 'fit-content' }}
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
          style={{ width: 'auto', height: 'fit-content' }}
          type='search'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder='Search'
        />

        <TodoListProgress todoListId={props.todoList.id} properties={['impact', 'estimate']} />

        <DropdownButton variant='outline-secondary' title={<BsGear />}>
          <Dropdown.Item onClick={handleExport}>Export list</Dropdown.Item>
          <Dropdown.Item onClick={handleImport}>Import list</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={deleteCompletedTasks} className='text-danger'>
            Delete all completed tasks
          </Dropdown.Item>
        </DropdownButton>
      </div>

      <TodoListTable
        sortedList={sortedList}
        windowWidth={windowWidth}
        minWidthForExtraColumns={minWidthForExtraColumns}
        handleTaskCheck={handleTaskCheck}
        handleSnoozeBtn={handleSnoozeBtn}
        setOpenedItem={setOpenedItem}
        todoListItemDeletionMutation={todoListItemDeletionMutation}
      />

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

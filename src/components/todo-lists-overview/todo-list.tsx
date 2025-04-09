'use client';

import classNames from 'classnames';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { BsGear, BsPlusLg } from 'react-icons/bs';
import { z } from 'zod';

import { useActiveTasks } from '@/contexts/active-tasks-context';
import { useSound } from '@/contexts/sound-context';
import { getPrioScore } from '@/get-prio-score';
import { useCreateTodoListItem } from '@/hooks/useCreateTodoListItem';
import { useDeleteTodoListItem } from '@/hooks/useDeleteTodoListItem';
import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { useUpdateTodoListItem } from '@/hooks/useUpdateTodoListItem';
import { isTaskRefined } from '@/item-helper';
import { TodoList } from '@/types/todo-list';
import { TodoListItem, TodoListItemSchema } from '@/types/todo-list-item';

import { EditTodoItemModal } from '../edit-item/edit-item';
import styles from './todo-list.module.scss';
import { TodoListProgress } from './todo-list-progress';
import { TodoListTable } from './todo-list-table';

interface TodoListCompProps {
  todoList: TodoList;
}

export const TodoListComp: React.FC<TodoListCompProps> = (props) => {
  const todoListItemsQuery = useGetTodoListItems(props.todoList.id);
  const todoListItemMutation = useUpdateTodoListItem();
  const todoListItemCreationMutation = useCreateTodoListItem();
  const todoListItemDeletionMutation = useDeleteTodoListItem();

  const [searchText, setSearchText] = useState('');
  const [openedItem, setOpenedItem] = useState<TodoListItem | null>(null);
  const [refineList, setRefineList] = useState<string[]>([]);
  const [isDraggingUrl, setIsDraggingUrl] = useState(false);
  const dragCounter = useRef(0);
  const { showOnlyActiveTasks } = useActiveTasks();

  const questStartSoundRef = useRef<HTMLAudioElement>(null);
  const questCompleteSoundRef = useRef<HTMLAudioElement>(null);
  const snoozeSoundRef = useRef<HTMLAudioElement>(null);

  const { soundEnabled } = useSound();

  const filteredList =
    todoListItemsQuery.data?.filter((item) => {
      if (showOnlyActiveTasks) {
        if (item.completed) {
          return false;
        }

        if (item.startDate && item.startDate > new Date()) {
          return false;
        }
      }

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
    completed: '' as unknown as Date,
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
    if (!soundEnabled) {
      return;
    }

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
      if (soundEnabled) {
        questCompleteSoundRef.current?.play();
      }

      if (item.intervalInDays > 0) {
        const newStartDate = new Date(new Date().setDate(new Date().getDate() + item.intervalInDays));
        const newItem: TodoListItem = {
          ...item,
          id: '',
          startDate: newStartDate,
          completed: '' as unknown as Date,
        };
        todoListItemCreationMutation.mutateAsync(newItem);
      }
    }

    todoListItemMutation.mutate({ ...item, completed: e.target.checked ? new Date() : ('' as unknown as Date) });
  };

  const handleSnoozeBtn = (task: TodoListItem, newStartDate: Date) => {
    todoListItemMutation.mutate({ ...task, startDate: newStartDate });
    if (soundEnabled) {
      snoozeSoundRef.current?.play();
    }
  };

  const getRefinementList = () =>
    todoListItemsQuery.data?.filter((item) => !item.completed).filter((x) => !isTaskRefined(x)) ?? [];

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

  const getOldCompletedTasks = () => {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const completedTasks = todoListItemsQuery.data?.filter((item) => item.completed) ?? [];
    return completedTasks.filter(
      (item) =>
        item.completed &&
        item.completed < new Date(Date.now() - thirtyDays) &&
        item.updated < new Date(Date.now() - thirtyDays),
    );
  };

  const deleteCompletedTasks = async () => {
    const oldCompletedTasks = getOldCompletedTasks();
    await Promise.all(oldCompletedTasks.map((item) => todoListItemDeletionMutation.mutateAsync(item)));
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
        item.id = '';
        item.todo_list_id = props.todoList.id;
      });

      for (const item of items) {
        await todoListItemCreationMutation.mutateAsync(item);
      }
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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;

    const items = Array.from(e.dataTransfer.items);
    const hasUrl = items.some(
      (item) => item.kind === 'string' && (item.type === 'text/uri-list' || item.type === 'text/plain'),
    );

    if (hasUrl) {
      setIsDraggingUrl(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDraggingUrl(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDraggingUrl(false);

    const url = e.dataTransfer.getData('text');
    if (!url.startsWith('http')) {
      return;
    }

    try {
      // Create a new item with the URL in the description
      const newItem = {
        ...newTodoListItem,
        description: url,
      };

      // Try to fetch the page title
      try {
        const response = await fetch(url);
        const html = await response.text();
        const match = html.match(/<title[^>]*>([^<]+)<\/title>/);
        if (match) {
          newItem.name = match[1].trim();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch page title:', error);
      }

      // If no title was found, use the URL as name
      if (!newItem.name) {
        try {
          const urlObj = new URL(url);
          newItem.name = urlObj.hostname + urlObj.pathname;
        } catch {
          newItem.name = url;
        }
      }

      setOpenedItem(newItem);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error handling dropped URL:', error);
    }
  };

  return (
    <div
      className={classNames(styles.dropZone, { [styles.dragOver]: isDraggingUrl })}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
            Delete all completed tasks that have been completed for more than 30 days{' '}
            {`(${getOldCompletedTasks().length})`}
          </Dropdown.Item>
        </DropdownButton>
      </div>

      <TodoListTable
        sortedList={sortedList}
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

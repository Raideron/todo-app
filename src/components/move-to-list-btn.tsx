import React from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import { useGetTodoLists } from '@/hooks/useGetTodoLists';
import { TodoListItem } from '@/types/todo-list-item';

interface MoveToListBtnProps {
  task: TodoListItem;
  onMoveToList: (newListId: string) => void;
}

export const MoveToListBtn: React.FC<MoveToListBtnProps> = (props) => {
  const { data: todoLists } = useGetTodoLists();

  const moveToList = (listId: string) => {
    props.onMoveToList(listId);
  };

  return (
    <DropdownButton as={ButtonGroup} variant='outline-primary' title={'Move to list'}>
      {todoLists?.map((list) => (
        <Dropdown.Item key={list.id} onClick={() => moveToList(list.id)}>
          {list.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

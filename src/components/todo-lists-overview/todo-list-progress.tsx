import { sum } from 'lodash';
import React from 'react';
import { Badge, Col, Row } from 'react-bootstrap';

import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { TodoListItem } from '@/types/todo-list-item';

interface TodoListProgressProps {
  todoListId: string;
  label: string;
  property: (task: TodoListItem) => number;
  periodInDays: number;
}

export const TodoListProgress: React.FC<TodoListProgressProps> = (props) => {
  const todoListItemsQuery = useGetTodoListItems(props.todoListId);
  const todoListItems = todoListItemsQuery.data ?? [];

  const formatPercent = Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 0,
  });
  const formatNumber = Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2,
  });

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - props.periodInDays);

  const addedAfterCutoffDateList = todoListItems
    .filter((task) => task.created >= cutoffDate)
    .filter((task) => task.isCompleted === false);
  const addedAfterCutoffDateSum = sum(addedAfterCutoffDateList.map(props.property));

  const completedAfterCutoffDateList = todoListItems
    .filter((task) => task.updated >= cutoffDate)
    .filter((task) => task.created < cutoffDate)
    .filter((task) => task.isCompleted === true);
  const completedAfterCutoffDateSum = sum(completedAfterCutoffDateList.map(props.property));

  const progressNet = addedAfterCutoffDateSum - completedAfterCutoffDateSum;
  const incompleteSum = sum(todoListItems.filter((task) => task.isCompleted === false).map(props.property));
  const progressPercent = progressNet / Math.max(incompleteSum, 1);

  let bg = 'secondary';
  if (progressNet > 0) {
    bg = 'danger';
  }
  if (progressNet < 0) {
    bg = 'success';
  }

  return (
    <Badge bg={bg}>
      <Row className='g-0'>
        <Col xs={12}>{props.label}</Col>
        <Col
          xs={12}
        >{`+${formatNumber.format(addedAfterCutoffDateSum)} -${formatNumber.format(completedAfterCutoffDateSum)}`}</Col>
        <Col xs={12}>{`${formatNumber.format(progressNet)} ${formatPercent.format(progressPercent)}`}</Col>
      </Row>
    </Badge>
  );
};

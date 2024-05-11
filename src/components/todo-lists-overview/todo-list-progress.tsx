import { sum } from 'lodash';
import React from 'react';
import { Badge, Table } from 'react-bootstrap';

import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { TodoListItem } from '@/types/todo-list-item';

interface TodoListProgressProps {
  todoListId: string;
  properties: (keyof TodoListItem)[];
}

export const TodoListProgress: React.FC<TodoListProgressProps> = (props) => {
  const todoListItemsQuery = useGetTodoListItems(props.todoListId);
  const todoListItems = todoListItemsQuery.data ?? [];

  /** Format percent */
  const fp = Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 0,
  });

  const getCutoffDate = (periodInDays: number): Date => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodInDays);
    return cutoffDate;
  };

  const getAddedAfterCutoffDateSum = (periodInDays: number, property: keyof TodoListItem): number => {
    const cutoffDate = getCutoffDate(periodInDays);
    const addedAfterCutoffDateList = todoListItems
      .filter((task) => task.created >= cutoffDate)
      .filter((task) => task.isCompleted === false);
    return sum(addedAfterCutoffDateList.map((task) => task[property]));
  };

  const getCompletedAfterCutoffDateSum = (periodInDays: number, property: keyof TodoListItem): number => {
    const cutoffDate = getCutoffDate(periodInDays);
    const completedAfterCutoffDateList = todoListItems
      .filter((task) => task.updated >= cutoffDate)
      .filter((task) => task.created < cutoffDate)
      .filter((task) => task.isCompleted === true);
    return sum(completedAfterCutoffDateList.map((task) => task[property]));
  };

  const getProgressPercent = (periodInDays: number, property: keyof TodoListItem): number => {
    const addedAfterCutoffDateSum = getAddedAfterCutoffDateSum(periodInDays, property);
    const completedAfterCutoffDateSum = getCompletedAfterCutoffDateSum(periodInDays, property);
    const progressNet = addedAfterCutoffDateSum - completedAfterCutoffDateSum;
    const incompleteSum = sum(todoListItems.filter((task) => task.isCompleted === false).map((task) => task[property]));
    return progressNet / Math.max(incompleteSum, 1);
  };

  const getColorVariant = (periodInDays: number, property: keyof TodoListItem): string => {
    let variant = '';
    const progressPercent = getProgressPercent(periodInDays, property);

    if (progressPercent > 0) {
      variant = 'danger';
    }
    if (progressPercent < 0) {
      variant = 'success';
    }
    return variant;
  };

  return (
    <Badge bg={'white'}>
      <Table borderless size='sm' style={{ background: 'transparent' }}>
        <thead>
          <tr>
            <th />
            {props.properties.map((property) => (
              <th key={property}>{property}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            {props.properties.map((property) => (
              <td key={property} className={`text-${getColorVariant(1, property)}`}>
                {fp.format(getProgressPercent(1, property))}
              </td>
            ))}
          </tr>
          <tr>
            <td>7</td>
            {props.properties.map((property) => (
              <td key={property} className={`text-${getColorVariant(1, property)}`}>
                {fp.format(getProgressPercent(7, property))}
              </td>
            ))}
          </tr>
          <tr>
            <td>30</td>
            {props.properties.map((property) => (
              <td key={property} className={`text-${getColorVariant(1, property)}`}>
                {fp.format(getProgressPercent(30, property))}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </Badge>
  );
};

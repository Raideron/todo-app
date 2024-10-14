import { UseMutationResult } from '@tanstack/react-query';
import React from 'react';
import { Button, ButtonGroup, Form, ListGroup } from 'react-bootstrap';
import { BsPencil, BsTrash } from 'react-icons/bs';

import { getEstimateDisplayValue } from '@/estimate-display-value';
import { getPrioScore } from '@/get-prio-score';
import { TodoListItem } from '@/types/todo-list-item';

import { SnoozeBtn } from '../snooze-btn';
import { TextWithLinks } from '../text-with-links';
import styles from './todo-list-table.module.scss';

interface TodoListTableProps {
  sortedList: TodoListItem[];
  handleTaskCheck: (e: React.ChangeEvent<HTMLInputElement>, item: TodoListItem) => void;
  handleSnoozeBtn: (task: TodoListItem, newStartDate: Date) => void;
  setOpenedItem: (item: TodoListItem) => void;
  todoListItemDeletionMutation: UseMutationResult;
}

export const TodoListTable: React.FC<TodoListTableProps> = ({
  sortedList,
  handleTaskCheck,
  handleSnoozeBtn,
  setOpenedItem,
  todoListItemDeletionMutation,
}) => {
  const formatDate = Intl.DateTimeFormat('nl-NL', {
    dateStyle: 'short',
  }).format;

  return (
    <ListGroup>
      {sortedList.map((item) => (
        <ListGroup.Item key={item.id} className={styles.listItem}>
          <div className={styles.checkbox}>
            <Form.Check type='checkbox' checked={item.isCompleted} onChange={(e) => handleTaskCheck(e, item)} />
          </div>
          <div className={styles.content}>
            <div className={item.isCompleted ? styles.completedTask : ''}>{item.name}</div>
            {item.description && (
              <div className={styles.description}>
                <TextWithLinks text={item.description} />
              </div>
            )}
            <div className={styles.details}>
              <small>Impact: {item.impact || 'N/A'}</small>
              <small>Estimate: {getEstimateDisplayValue(item.estimate, item.estimate < 1 ? 'm' : 'h')}</small>
              <small>
                Deadline: <wbr />
                <span style={{ wordWrap: 'normal', textWrap: 'nowrap' }}>
                  {item.deadline ? formatDate(item.deadline) : 'N/A'}
                </span>
              </small>
              <small>Prio: {Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(getPrioScore(item))}</small>
            </div>
          </div>
          <div className={styles.actions}>
            <ButtonGroup vertical>
              <SnoozeBtn task={item} onSnooze={(newStartDate) => handleSnoozeBtn(item, newStartDate)} />
              <Button variant='outline-primary' size='sm' onClick={() => setOpenedItem(item)}>
                <BsPencil />
              </Button>
              <Button variant='outline-danger' size='sm' onClick={() => todoListItemDeletionMutation.mutate(item)}>
                <BsTrash />
              </Button>
            </ButtonGroup>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

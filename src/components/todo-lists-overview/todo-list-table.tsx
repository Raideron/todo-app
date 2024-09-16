import React from 'react';
import { Button, ButtonGroup, Form, Table } from 'react-bootstrap';
import { BsPencil, BsTrash } from 'react-icons/bs';

import { getEstimateDisplayValue } from '@/estimate-display-value';
import { getPrioScore } from '@/get-prio-score';
import { TodoListItem } from '@/types/todo-list-item';

import { Cell } from '../cell';
import { SnoozeBtn } from '../snooze-btn';

interface TodoListTableProps {
  sortedList: TodoListItem[];
  windowWidth: number;
  minWidthForExtraColumns: number;
  handleTaskCheck: (e: React.ChangeEvent<HTMLInputElement>, item: TodoListItem) => void;
  handleSnoozeBtn: (task: TodoListItem, newStartDate: Date) => void;
  setOpenedItem: (item: TodoListItem) => void;
  todoListItemDeletionMutation: any; // Replace 'any' with the actual type
}

export const TodoListTable: React.FC<TodoListTableProps> = ({
  sortedList,
  windowWidth,
  minWidthForExtraColumns,
  handleTaskCheck,
  handleSnoozeBtn,
  setOpenedItem,
  todoListItemDeletionMutation,
}) => (
  <Table striped borderless hover className='m-0' responsive>
    <thead>
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
                onChange={(e) => handleTaskCheck(e, item)}
              />
            </div>
          </td>

          <Cell value={item.name} type='text' isComplete={item.isCompleted} subText={item.description} />

          {windowWidth > minWidthForExtraColumns && (
            <>
              <Cell value={item.impact || null} type='number' isComplete={item.isCompleted} width={'5em'} />

              <Cell
                value={getEstimateDisplayValue(item.estimate, item.estimate < 1 ? 'm' : 'h')}
                type='number'
                isComplete={item.isCompleted}
                width={'5em'}
              />

              <Cell value={item.deadline ?? null} type='date' isComplete={item.isCompleted} width={'12em'} />

              <td style={{ textDecorationLine: item.isCompleted ? 'line-through' : undefined, width: '6em' }}>
                {Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(getPrioScore(item))}
              </td>
            </>
          )}

          <td style={{ width: 1 }}>
            <ButtonGroup>
              <SnoozeBtn task={item} onSnooze={(newStartDate) => handleSnoozeBtn(item, newStartDate)} />
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
);

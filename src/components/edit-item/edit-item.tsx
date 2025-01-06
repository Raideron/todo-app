import React from 'react';
import { Button, ButtonGroup, Col, Form, FormLabel, InputGroup, Modal, Row } from 'react-bootstrap';
import { BsXLg } from 'react-icons/bs';

import { TodoListItem } from '@/types/todo-list-item';

import { MoveToListBtn } from '../move-to-list-btn';
import { SnoozeBtn } from '../snooze-btn';
import { EstimateInput } from './estimate-input';

interface EditTodoItemModalProps {
  localItem: TodoListItem | null;
  onChange: (item: Partial<TodoListItem>) => void;
  onSave: () => void;
  onClose: () => void;
  onNextPrev: (delta: -1 | 1) => void;
}

export const EditTodoItemModal: React.FC<EditTodoItemModalProps> = (props) => {
  const showModal = !!props.localItem;

  /** Returns string in format "yyyy-MM-ddThh:mm" or an empty string if date is undefined */
  const getDatetimeLocalString = (date: Date | undefined): string => {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  /** Handles date input changes, setting to undefined if empty string */
  const handleDateChange = (
    field: 'startDate' | 'deadline',
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    props.onChange({ [field]: value ? new Date(value) : '' });
  };

  /** Ctrl + Enter to save and close */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      props.onSave();
    }
  };

  return (
    <Modal show={showModal} onHide={props.onClose} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!!props.localItem && (
          <Row onKeyDown={handleKeyDown}>
            <Col xs={12} className='mb-2'>
              <Form.Label htmlFor='name'>Name</Form.Label>
              <Form.Control
                id='name'
                value={props.localItem.name}
                onChange={(e) => props.onChange({ name: e.target.value })}
                autoFocus
              />
            </Col>

            <Col xs={12} className='mb-3'>
              <FormLabel htmlFor='description'>Description</FormLabel>
              <Form.Control
                id='description'
                value={props.localItem.description}
                onChange={(e) => props.onChange({ description: e.target.value })}
                as='textarea'
                rows={3}
              />
            </Col>

            <Col xs={6} className='mb-2'>
              <Form.Label htmlFor='impact'>Impact</Form.Label>
              <Form.Control
                id='impact'
                value={props.localItem.impact}
                onChange={(e) => props.onChange({ impact: +e.target.value })}
                type='number'
              />
            </Col>
            <Col xs={6} className='mb-2'>
              <EstimateInput
                key={props.localItem.id} // Fixes a bug with unit switch not working after switching task
                localItem={props.localItem}
                onChange={props.onChange}
                onSave={props.onSave}
                onClose={props.onClose}
                onNextPrev={props.onNextPrev}
              />
            </Col>

            <Col xs={6} className='mb-2'>
              <Form.Label htmlFor='startDate'>Start Date</Form.Label>
              <Form.Control
                id='startDate'
                value={getDatetimeLocalString(props.localItem.startDate)}
                onChange={(e) => handleDateChange('startDate', e)}
                type='datetime-local'
              />
            </Col>
            <Col xs={6} className='mb-2'>
              <Form.Label htmlFor='deadline'>Deadline</Form.Label>
              <Form.Control
                id='deadline'
                value={getDatetimeLocalString(props.localItem.deadline)}
                onChange={(e) => handleDateChange('deadline', e)}
                type='datetime-local'
              />
            </Col>

            <Col xs={6} className='mb-2'>
              <Form.Label htmlFor='intervalInDays'>Repeat every (days)</Form.Label>
              <InputGroup>
                <Form.Control
                  id='intervalInDays'
                  value={props.localItem.intervalInDays}
                  onChange={(e) => props.onChange({ intervalInDays: +e.target.value })}
                  type='number'
                />
                <Button
                  variant='outline-secondary'
                  onClick={() => props.onChange({ intervalInDays: 0 })}
                  className='d-flex align-items-center'
                >
                  <BsXLg />
                </Button>
              </InputGroup>
            </Col>

            <Col xs={6} className='mb-2'>
              <Form.Label htmlFor='confidence'>Confidence</Form.Label>
              <Form.Control
                id='confidence'
                value={props.localItem.confidence}
                onChange={(e) => props.onChange({ confidence: +e.target.value })}
                type='number'
              />
            </Col>

            <Col xs={'auto'} className='mb-2'>
              <Form.Label className='d-block'>Snooze</Form.Label>
              <SnoozeBtn
                task={props.localItem}
                onSnooze={(newStartDate) => props.onChange({ startDate: newStartDate })}
              />
            </Col>

            <Col xs={'auto'} className='mb-2'>
              <Form.Label htmlFor='completed'>Completed</Form.Label>
              <Form.Check
                id='completed'
                checked={!!props.localItem.completed}
                onChange={(e) => props.onChange({ completed: e.target.checked ? new Date() : undefined })}
              />
            </Col>

            <Col xs={'auto'} className='mb-2'>
              <Form.Label className='d-block'>Move to list</Form.Label>
              <MoveToListBtn
                task={props.localItem}
                onMoveToList={(newListId) => props.onChange({ todo_list_id: newListId })}
              />
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer className='d-flex justify-content-between'>
        <ButtonGroup>
          <Button variant={'outline-primary'} onClick={() => props.onNextPrev(-1)}>
            Previous task
          </Button>
          <Button variant={'outline-primary'} onClick={() => props.onNextPrev(1)}>
            Next task
          </Button>
        </ButtonGroup>

        <Button variant='primary' onClick={props.onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

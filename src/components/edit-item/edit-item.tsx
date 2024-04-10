import React from 'react';
import { Button, ButtonGroup, Col, Form, FormLabel, Modal, Row } from 'react-bootstrap';

import { TodoListItem } from '@/types/todo-list-item';

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

  /** Returns string in format "yyyy-MM-ddThh:mm" */
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

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
          <Row onKeyDown={handleEnter}>
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
                onKeyDown={(e) => e.stopPropagation()}
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
                onChange={(e) => props.onChange({ startDate: new Date(e.target.value) })}
                type='datetime-local'
              />
            </Col>
            <Col xs={6} className='mb-2'>
              <Form.Label htmlFor='deadline'>Deadline</Form.Label>
              <Form.Control
                id='deadline'
                value={getDatetimeLocalString(props.localItem.deadline)}
                onChange={(e) => props.onChange({ deadline: new Date(e.target.value) })}
                type='datetime-local'
              />
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

            <Col xs={6} className='mb-2'>
              <Form.Label className='d-block'>Snooze</Form.Label>
              <SnoozeBtn
                task={props.localItem}
                onSnooze={(newStartDate) => props.onChange({ startDate: newStartDate })}
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

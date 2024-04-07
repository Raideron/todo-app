import React from 'react';
import { Button, Col, Form, FormLabel, Modal, Row } from 'react-bootstrap';

import { TodoListItem } from '@/types/todo-list-item';

interface EditTodoItemModalProps {
  localItem: TodoListItem | null;
  onChange: (item: Partial<TodoListItem>) => void;
  onSave: () => void;
  onClose: () => void;
}

export const EditTodoItemModal: React.FC<EditTodoItemModalProps> = (props) => {
  const showModal = !!props.localItem;

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      props.onSave();
    }
  };

  return (
    <Modal show={showModal} onHide={props.onClose}>
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
              <Form.Label htmlFor='estimate'>Estimate</Form.Label>
              <Form.Control
                id='estimate'
                value={props.localItem.estimate}
                onChange={(e) => props.onChange({ estimate: +e.target.value })}
                type='number'
              />
            </Col>

            <Col xs={6} className='mb-2'>
              <Form.Label htmlFor='deadline'>Deadline</Form.Label>
              <Form.Control
                id='deadline'
                value={props.localItem.deadline?.toISOString().split('T')[0]}
                onChange={(e) => props.onChange({ deadline: new Date(e.target.value) })}
                type='date'
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
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={props.onClose}>
          Close
        </Button>
        <Button variant='primary' onClick={props.onSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

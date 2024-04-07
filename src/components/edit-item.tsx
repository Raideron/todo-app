import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

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
              <Form.Control
                value={props.localItem.name}
                onChange={(e) => props.onChange({ name: e.target.value })}
                autoFocus
              />
            </Col>

            <Col xs={12} className='mb-3'>
              <Form.Control
                value={props.localItem.description}
                onChange={(e) => props.onChange({ description: e.target.value })}
              />
            </Col>

            <Col xs={6} className='mb-2'>
              <Form.Control
                value={props.localItem.impact}
                onChange={(e) => props.onChange({ impact: +e.target.value })}
                type='number'
              />
            </Col>
            <Col xs={6} className='mb-2'>
              <Form.Control
                value={props.localItem.estimate}
                onChange={(e) => props.onChange({ estimate: +e.target.value })}
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

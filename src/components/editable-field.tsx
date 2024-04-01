'use client';

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface EditableFieldProps {
  value: string | number | Date | null;
  type: 'text' | 'number' | 'date';
  onChange: (value: string) => void;
}

export const EditableField: React.FC<EditableFieldProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing) {
    return <span onClick={() => setIsEditing(true)}>{props.value?.toString()}</span>;
  }

  return (
    <Form.Control
      type={props.type}
      value={props.value?.toString() || ''}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

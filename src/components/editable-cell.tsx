'use client';

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface EditableCellProps {
  value: string | number | Date | null;
  type: 'text' | 'number' | 'date';
  onChange: (value: string) => void;
}

export const EditableCell: React.FC<EditableCellProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const getValue = (): string => {
    if (props.value === null) {
      return '';
    }
    if (props.type === 'date') {
      return (props.value as Date).toISOString().split('T')[0];
    }
    return props.value.toString();
  };

  const getDisplayValue = (): string => {
    if (props.value === null) {
      return '';
    }
    if (props.type === 'date') {
      return (props.value as Date).toISOString().split('T')[0];
    }
    return props.value.toString();
  };

  return (
    <td onClick={() => setIsEditing(true)}>
      {isEditing ? (
        <Form.Control type={props.type} value={getValue()} onChange={(e) => props.onChange(e.target.value)} />
      ) : (
        <span>{getDisplayValue()}</span>
      )}
    </td>
  );
};

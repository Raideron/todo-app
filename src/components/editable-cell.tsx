'use client';

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface EditableCellProps {
  value: string | number | Date | null;
  type: 'text' | 'number' | 'date';
  isEditing: boolean;
  onChange: (value: string) => void;
  onClick: () => void;
}

export const EditableCell: React.FC<EditableCellProps> = (props) => {
  const isEditing = props.isEditing;

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
    <td onClick={props.onClick}>
      {isEditing ? (
        <Form.Control type={props.type} value={getValue()} onChange={(e) => props.onChange(e.target.value)} />
      ) : (
        <span>{getDisplayValue()}</span>
      )}
    </td>
  );
};

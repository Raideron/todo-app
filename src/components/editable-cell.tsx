'use client';

import React from 'react';
import { Form } from 'react-bootstrap';

interface EditableCellProps {
  value: string | number | Date | null;
  type: 'text' | 'number' | 'date';
  isEditing: boolean;
  isComplete: boolean;
  onChange: (value: string) => void;
  onClick: () => void;
  onEnter: () => void;
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

    if (typeof props.value === 'number') {
      const formattedValue = Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
      }).format(props.value);
      return formattedValue;
    }

    if (typeof props.value === 'string') {
      return props.value;
    }

    const isDate = props.value instanceof Date;
    if (isDate) {
      const formattedDate = Intl.DateTimeFormat('nl-NL', {}).format(props.value);
      return formattedDate;
    }

    return props.value.toString();
  };

  return (
    <td onClick={props.onClick}>
      {isEditing ? (
        <Form.Control
          autoFocus
          type={props.type}
          value={getValue()}
          onChange={(e) => props.onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              props.onEnter();
            }
          }}
        />
      ) : (
        // striketrough if completed
        <span style={{ textDecorationLine: props.isComplete ? 'line-through' : undefined }}>{getDisplayValue()}</span>
      )}
    </td>
  );
};

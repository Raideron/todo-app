'use client';

import React from 'react';

import { getDaysRemaining } from '@/get-prio-score';

import { TextWithLinks } from './text-with-links';

interface CellProps {
  value: string | number | Date | null;
  type: 'text' | 'number' | 'date';
  subText?: string;
  isComplete: boolean;
  width?: string | number;
}

export const Cell: React.FC<CellProps> = (props) => {
  const getDisplayValue = (): string => {
    if (props.value === null) {
      return '';
    }
    if (props.type === 'date' && props.value instanceof Date) {
      const formattedDate = Intl.DateTimeFormat('nl-NL', {
        dateStyle: 'long',
      }).format(props.value);
      const daysRemaining = getDaysRemaining(props.value);
      return `${formattedDate} (${daysRemaining} days)`;
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
    <td style={{ width: props.width, maxWidth: '20em' }}>
      <span className='d-block' style={{ textDecorationLine: props.isComplete ? 'line-through' : undefined }}>
        {getDisplayValue()}
      </span>
      <span
        className={'d-block text-muted'}
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TextWithLinks text={props.subText ?? ''} />
      </span>
    </td>
  );
};

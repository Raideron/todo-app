import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

import { getEstimateConvertedNumber } from '@/estimate-display-value';
import { TodoListItem } from '@/types/todo-list-item';

interface EstimateInputProps {
  localItem: TodoListItem | null;
  onChange: (item: Partial<TodoListItem>) => void;
  onSave: () => void;
  onClose: () => void;
  onNextPrev: (delta: -1 | 1) => void;
}

export const EstimateInput: React.FC<EstimateInputProps> = (props) => {
  const [estimateUnit, _setEstimateUnit] = useState<'h' | 'm'>(
    props.localItem && props.localItem.estimate >= 1 ? 'h' : 'm',
  );

  const setEstimateUnit = (unit: 'h' | 'm') => {
    if (!props.localItem) {
      return;
    }

    if (unit === estimateUnit) {
      return;
    }

    _setEstimateUnit(unit);

    if (unit === 'h') {
      props.onChange({ estimate: props.localItem.estimate * 60 });
    }

    if (unit === 'm') {
      props.onChange({ estimate: props.localItem.estimate / 60 });
    }
  };

  const getEstimateDisplayValue = (): string => {
    if (!props.localItem) {
      return '';
    }

    return `${getEstimateConvertedNumber(props.localItem.estimate, estimateUnit)}`;
  };

  const handleEstimateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = +e.target.value;
    const convertedValue = estimateUnit === 'm' ? rawValue / 60 : rawValue;
    props.onChange({ estimate: convertedValue });
  };

  const handleEstimateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'm') {
      e.preventDefault();
      setEstimateUnit('m');
      return;
    }

    if (e.key === 'h') {
      e.preventDefault();
      setEstimateUnit('h');
      return;
    }
  };

  const handleEstimateUnitClick = () => {
    setEstimateUnit(estimateUnit === 'h' ? 'm' : 'h');
  };

  return (
    <>
      <Form.Label htmlFor='estimate'>Estimate</Form.Label>
      <InputGroup>
        <Form.Control
          id='estimate'
          value={getEstimateDisplayValue()}
          onChange={handleEstimateChange}
          onKeyDown={handleEstimateKeyDown}
          type='number'
        />
        <Button variant={'outline-secondary'} onClick={handleEstimateUnitClick}>
          {estimateUnit}
        </Button>
      </InputGroup>
    </>
  );
};

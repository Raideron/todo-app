import React from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import { TodoListItem } from '@/types/todo-list-item';

interface SnoozeBtnProps {
  task: TodoListItem;
  onSnooze: (newStartDate: Date) => void;
}

export const SnoozeBtn: React.FC<SnoozeBtnProps> = (props) => {
  const snoozeForDuration = (durationInMinutes: number) => {
    const newStartDate = new Date(Date.now() + durationInMinutes * 60 * 1000);
    props.onSnooze(newStartDate);
  };

  const snoozeTillTomorrow = () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);

    props.onSnooze(tomorrow);
  };

  /**
   * @param targetDayOfTheWeek 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
   */
  const snoozeTillDayOfWeek = (targetDayOfTheWeek: number) => {
    const date = new Date();
    const currentDay = date.getDay();
    const daysUntilTargetDay = (targetDayOfTheWeek + 7 - currentDay) % 7;
    date.setDate(date.getDate() + daysUntilTargetDay);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    props.onSnooze(date);
  };

  const snoozeTillTime = (hours: number, minutes: number) => {
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    props.onSnooze(date);
  };

  return (
    <DropdownButton as={ButtonGroup} variant='outline-primary' title={'Snooze'}>
      <Dropdown.Item onClick={() => snoozeForDuration(10)}>10 minutes</Dropdown.Item>
      <Dropdown.Item onClick={() => snoozeForDuration(60)}>1 hour</Dropdown.Item>
      <Dropdown.Item onClick={() => snoozeTillTime(13, 0)}>Afternoon</Dropdown.Item>
      <Dropdown.Item onClick={() => snoozeForDuration(60 * 24)}>1 day</Dropdown.Item>
      <Dropdown.Item onClick={snoozeTillTomorrow}>Tomorrow</Dropdown.Item>
      <Dropdown.Item onClick={() => snoozeTillDayOfWeek(1)}>Next Monday</Dropdown.Item>
      <Dropdown.Item onClick={() => snoozeTillDayOfWeek(4)}>Next Thursday</Dropdown.Item>
    </DropdownButton>
  );
};

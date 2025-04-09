import React from 'react';
import { Button } from 'react-bootstrap';
import { MdChecklist } from 'react-icons/md';
import { RiZzzFill } from 'react-icons/ri';

import { useActiveTasks } from '@/contexts/active-tasks-context';

export const ActiveTasksToggle: React.FC = () => {
  const { showOnlyActiveTasks, setShowOnlyActiveTasks } = useActiveTasks();

  return (
    <Button
      variant='outline-secondary'
      className='me-2'
      onClick={() => setShowOnlyActiveTasks(!showOnlyActiveTasks)}
      title={showOnlyActiveTasks ? 'Show all tasks' : 'Show only active tasks'}
    >
      {showOnlyActiveTasks ? <MdChecklist /> : <RiZzzFill />}
    </Button>
  );
};

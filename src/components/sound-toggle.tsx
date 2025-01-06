import React from 'react';
import { Button } from 'react-bootstrap';
import { BsSoundwave, BsVolumeMute } from 'react-icons/bs';

import { useSound } from '@/contexts/sound-context';

export const SoundToggle: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useSound();

  return (
    <Button
      variant='outline-secondary'
      className='me-2'
      onClick={() => setSoundEnabled(!soundEnabled)}
      title={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
    >
      {soundEnabled ? <BsSoundwave /> : <BsVolumeMute />}
    </Button>
  );
};

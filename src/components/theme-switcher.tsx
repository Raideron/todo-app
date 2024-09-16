import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { BsCircleHalf, BsMoon, BsSun } from 'react-icons/bs';

import { useTheme } from '@/contexts/theme-context';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown>
      <Dropdown.Toggle variant='outline-secondary' id='dropdown-theme'>
        {theme === 'light' && <BsSun />}
        {theme === 'dark' && <BsMoon />}
        {theme === 'auto' && <BsCircleHalf />}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => setTheme('light')} active={theme === 'light'}>
          <BsSun className='me-2' /> Light
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setTheme('dark')} active={theme === 'dark'}>
          <BsMoon className='me-2' /> Dark
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setTheme('auto')} active={theme === 'auto'}>
          <BsCircleHalf className='me-2' /> Auto
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

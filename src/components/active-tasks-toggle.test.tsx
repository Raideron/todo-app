import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { ActiveTasksProvider } from '@/contexts/active-tasks-context';

import { ActiveTasksToggle } from './active-tasks-toggle';

// Mock the icons to avoid SVG rendering issues in tests
jest.mock('react-icons/md', () => ({
  MdChecklist: () => <span data-testid='checklist-icon'>Checklist</span>,
}));

jest.mock('react-icons/ri', () => ({
  RiZzzFill: () => <span data-testid='zzz-icon'>ZZZ</span>,
}));

describe('ActiveTasksToggle', () => {
  const renderToggle = () =>
    render(
      <ActiveTasksProvider>
        <ActiveTasksToggle />
      </ActiveTasksProvider>,
    );

  it('renders the toggle button', () => {
    renderToggle();
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('shows ZZZ icon and "Show only active tasks" title when not showing active tasks', () => {
    renderToggle();
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Show only active tasks');
    expect(screen.getByTestId('zzz-icon')).toBeInTheDocument();
  });

  it('shows Checklist icon and "Show all tasks" title when showing active tasks', () => {
    renderToggle();
    const button = screen.getByRole('button');

    // Click to toggle to active tasks view
    fireEvent.click(button);

    expect(button).toHaveAttribute('title', 'Show all tasks');
    expect(screen.getByTestId('checklist-icon')).toBeInTheDocument();
  });
});

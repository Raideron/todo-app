'use client';

import React from 'react';
import { Table } from 'react-bootstrap';

import { useGetTodoListItems } from '@/hooks/useGetTodoListItems';
import { TodoList } from '@/types/todo-list';

interface TodoListCompProps {
  todoList: TodoList;
}

export const TodoListComp: React.FC<TodoListCompProps> = (props) => {
  const todoListItems = useGetTodoListItems(props.todoList.id);

  console.log({ ...todoListItems });

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Estimate</th>
            <th>Impact</th>
          </tr>
        </thead>

        <tbody>
          {todoListItems.data?.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.deadline?.toLocaleDateString()}</td>
              <td>{item.estimate}</td>
              <td>{item.impact}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

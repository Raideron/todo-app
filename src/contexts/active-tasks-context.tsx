import React, { createContext, useContext, useEffect, useState } from 'react';

interface ActiveTasksContextType {
  showOnlyActiveTasks: boolean;
  setShowOnlyActiveTasks: (enabled: boolean) => void;
}

const ActiveTasksContext = createContext<ActiveTasksContextType | undefined>(undefined);

export const ActiveTasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showOnlyActiveTasks, setShowOnlyActiveTasks] = useState(false);

  useEffect(() => {
    const storedShowOnlyActiveTasks = localStorage.getItem('showOnlyActiveTasks');
    if (storedShowOnlyActiveTasks !== null) {
      setShowOnlyActiveTasks(storedShowOnlyActiveTasks === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('showOnlyActiveTasks', showOnlyActiveTasks.toString());
  }, [showOnlyActiveTasks]);

  return (
    <ActiveTasksContext.Provider value={{ showOnlyActiveTasks, setShowOnlyActiveTasks }}>
      {children}
    </ActiveTasksContext.Provider>
  );
};

export const useActiveTasks = () => {
  const context = useContext(ActiveTasksContext);
  if (context === undefined) {
    throw new Error('useActiveTasks must be used within an ActiveTasksProvider');
  }
  return context;
};

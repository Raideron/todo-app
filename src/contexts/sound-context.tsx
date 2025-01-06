import React, { createContext, useContext, useEffect, useState } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const storedSoundEnabled = localStorage.getItem('soundEnabled');
    if (storedSoundEnabled !== null) {
      setSoundEnabled(storedSoundEnabled === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  return <SoundContext.Provider value={{ soundEnabled, setSoundEnabled }}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

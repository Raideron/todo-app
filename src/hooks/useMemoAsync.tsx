import { DependencyList, useEffect, useState } from 'react';

export function useMemoAsync<T>(initialValue: T, getFunction: () => Promise<T>, dependencyList: DependencyList): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const updateValue = async () => {
      const newValue = await getFunction();
      setValue(newValue);
    };
    try {
      updateValue();
    } catch (error) {
      console.error(error);
    }
  }, dependencyList);

  return value;
}

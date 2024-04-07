'use client';

import { useQuery } from '@tanstack/react-query';

import { HEALTH_CHECK } from '@/api/api-keys';
import { pb } from '@/pocketbase';

export const usePbHealthCheck = () => {
  const query = useQuery({
    queryKey: HEALTH_CHECK(),
    queryFn: async ({ signal }) => {
      const result = await pb.health.check({ signal });
      // eslint-disable-next-line no-console
      console.info('Health check result:', result);
      return result;
    },
  });

  return query;
};

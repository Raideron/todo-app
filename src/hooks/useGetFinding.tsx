import { useQuery } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { GET_FINDING_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { FindingSchema } from '@/types/finding';

export const useGetFinding = (findingId: string) => {
  const findingQuery = useQuery({
    queryKey: GET_FINDING_KEY(findingId),
    queryFn: async ({ signal }) => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const result = await pb.collection('findings').getOne(findingId, {
        signal,
      });
      const finding = FindingSchema.parse(result);
      return finding;
    },
  });

  return findingQuery;
};

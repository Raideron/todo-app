import { useMutation, useQueryClient } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { GET_FINDING_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { Finding } from '@/types/finding';

export const useUpdateFinding = (findingId: string) => {
  const queryClient = useQueryClient();

  const updateFindingMutation = useMutation({
    mutationFn: async (finding: Finding) => {
      const pb = new PocketBase(POCKET_BASE_URL);
      await pb.collection('findings').update(finding.id, finding);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: GET_FINDING_KEY(findingId),
      });
    },
    onMutate: async (updatedFinding) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      queryClient.cancelQueries({ queryKey: GET_FINDING_KEY(findingId) });

      // Optimistically update to the new value
      queryClient.setQueryData<Finding>(GET_FINDING_KEY(findingId), () => updatedFinding);
    },
  });

  return updateFindingMutation;
};

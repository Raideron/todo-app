import { useQuery } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { GET_INSPECTION_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { InspectionSchema } from '@/types/inspection';

export const useGetInspection = (inspectionId: string) => {
  const inspectionQuery = useQuery({
    queryKey: GET_INSPECTION_KEY(inspectionId),
    queryFn: async ({ signal }) => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const result = await pb.collection('inspections').getOne(inspectionId, { signal });
      const inspection = InspectionSchema.parse(result);
      return inspection;
    },
  });
  return inspectionQuery;
};

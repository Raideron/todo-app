import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import PocketBase from 'pocketbase';

import { GET_FINDINGS_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { FindingSchema } from '@/types/finding';

import { useGetInspection } from './useGetInspection';

export const useGetFindings = (inspectionId: string) => {
  const inspectionQuery = useGetInspection(inspectionId);
  const inspection = inspectionQuery.data;

  const findingsQuery = useQuery({
    queryKey: GET_FINDINGS_KEY(inspection?.findingIds || []),
    queryFn: async ({ signal }) => {
      if (!inspection) {
        return [];
      }

      // check needed because otherwise filter will be empty and we get all findings
      if (inspection.findingIds.length === 0) {
        return [];
      }

      const pb = new PocketBase(POCKET_BASE_URL);
      const filter = inspection.findingIds.map((x) => pb.filter('id = {:id}', { id: x })).join(' || ');
      const findings = await pb.collection('findings').getList(undefined, undefined, {
        filter: filter,
        signal,
      });
      const parsedFindings = findings.items.map((x) => FindingSchema.parse(x));
      return parsedFindings;
    },
    select: (data) => _.orderBy(data, (x) => x.created, 'asc'),
    enabled: inspectionQuery.isSuccess,
    initialData: [],
  });

  return findingsQuery;
};

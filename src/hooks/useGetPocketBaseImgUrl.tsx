import { useQuery } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { Finding } from '@/types/finding';

export const useGetPocketBaseImgUrl = () => {
  const findingsCollectionKey = useQuery({
    queryKey: ['findingsCollectionId'],
    queryFn: async () => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const collectionId = pb.collection('findings').collectionIdOrName;
      return collectionId;
    },
  });

  const getPocketBaseUrlForImg = (finding: Finding): string | null => {
    if (!finding.picture) {
      return null;
    }

    const pb = new PocketBase(POCKET_BASE_URL);
    const record = {
      id: finding.id,
      collectionId: findingsCollectionKey.data,
    };
    const url = pb.files.getUrl(record, finding.picture, { thumb: '100x100' });
    return url;
  };

  return getPocketBaseUrlForImg;
};

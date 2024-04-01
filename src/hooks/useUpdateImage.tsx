import { useMutation, useQueryClient } from '@tanstack/react-query';
import mime from 'mime';
import PocketBase from 'pocketbase';

import { GET_FINDING_KEY, GET_FINDINGS_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';

import { useGetInspection } from './useGetInspection';

export const useUpdateImage = (inspectionId: string) => {
  const queryClient = useQueryClient();

  const inspectionQuery = useGetInspection(inspectionId);

  const uploadPictureMutation = useMutation({
    mutationFn: async (data: { findingId: string; picture: string }) => {
      const pb = new PocketBase(POCKET_BASE_URL);

      const firstPart = data.picture.split(';base64,')[0];
      const base64Data = data.picture.split(';base64,')[1];
      const dataValue = firstPart.split('data:')[1];

      const mimeType = dataValue;

      const extension = mime.getExtension(mimeType ?? '');
      if (!extension) {
        // eslint-disable-next-line no-console
        console.error('Could not determine extension');
        return;
      }

      // Convert base64 to byte array before creating the Blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: mimeType });
      const file = new File([blob], `image.${extension}`, { type: mimeType });
      return await pb.collection('findings').update(data.findingId, { picture: file });
    },
    onSettled: async (data) => {
      queryClient.invalidateQueries({
        queryKey: GET_FINDINGS_KEY(inspectionQuery.data?.findingIds ?? []),
      });

      queryClient.invalidateQueries({
        queryKey: GET_FINDING_KEY(data?.id ?? ''),
      });
    },
  });

  return uploadPictureMutation;
};

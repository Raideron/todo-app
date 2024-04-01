'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import mime from 'mime';
import PocketBase from 'pocketbase';
import React from 'react';
import { Button, Form, Image, Table } from 'react-bootstrap';

import { GET_FINDINGS_KEY, GET_INSPECTION_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { useGetPocketBaseImgUrl } from '@/hooks/useGetPocketBaseImgUrl';
import { useUpdateImage } from '@/hooks/useUpdateImage';
import { Finding, FindingSchema } from '@/types/finding';
import { Inspection } from '@/types/inspection';

import { CameraModalBtn } from './camera-modal';

interface FindingsListProps {
  inspection: Inspection;
}

export const FindingsList: React.FC<FindingsListProps> = (props) => {
  const queryClient = useQueryClient();

  const getPocketBaseUrlForImg = useGetPocketBaseImgUrl();

  const findingsQuery = useQuery({
    queryKey: GET_FINDINGS_KEY(props.inspection.findingIds),
    queryFn: async () => {
      // check needed because otherwise filter will be empty and we get all findings
      if (props.inspection.findingIds.length === 0) {
        return [];
      }

      const pb = new PocketBase(POCKET_BASE_URL);
      const filter = props.inspection.findingIds.map((x) => pb.filter('id = {:id}', { id: x })).join(' || ');
      const findings = await pb.collection('findings').getList(undefined, undefined, {
        filter: filter,
      });
      const parsedFindings = findings.items.map((x) => FindingSchema.parse(x));
      return parsedFindings;
    },
    select: (data) => _.orderBy(data, (x) => x.created, 'asc'),
    staleTime: 5000,
  });

  const findingsMutation = useMutation({
    mutationFn: async (finding: Finding) => {
      const pb = new PocketBase(POCKET_BASE_URL);
      await pb.collection('findings').update(finding.id, finding);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: GET_FINDINGS_KEY(props.inspection.findingIds),
      });
    },
    onMutate: async (updatedFinding) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      queryClient.cancelQueries({ queryKey: GET_FINDINGS_KEY(props.inspection.findingIds) });

      // Optimistically update to the new value
      queryClient.setQueryData(GET_FINDINGS_KEY(props.inspection.findingIds), (old: Finding[]) =>
        old.map((finding) => {
          if (finding.id === updatedFinding.id) {
            return updatedFinding;
          }
          return finding;
        }),
      );
    },
  });

  const createFindingMutation = useMutation({
    mutationFn: async () => {
      if (!findingsQuery.data) {
        return;
      }

      const pb = new PocketBase(POCKET_BASE_URL);
      const newFinding = await pb.collection('findings').create({ description: '' });
      const parsedFinding = FindingSchema.parse(newFinding);
      await pb.collection('inspections').update(props.inspection.id, {
        findingIds: [...findingsQuery.data.map((x) => x.id), parsedFinding.id],
      });
      return parsedFinding;
    },
    onSettled: async (data) => {
      queryClient.invalidateQueries({
        queryKey: GET_FINDINGS_KEY(props.inspection.findingIds),
      });
      queryClient.invalidateQueries({
        queryKey: GET_INSPECTION_KEY(props.inspection.id),
      });
    },
  });

  const deleteFindingMutation = useMutation({
    mutationFn: async (id: string) => {
      const pb = new PocketBase(POCKET_BASE_URL);
      await pb.collection('findings').delete(id);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: GET_FINDINGS_KEY(props.inspection.findingIds),
      });
      queryClient.invalidateQueries({
        queryKey: GET_INSPECTION_KEY(props.inspection.id),
      });
    },
  });

  const uploadPictureMutation = useUpdateImage(props.inspection.id);

  const handleCaptureImage = (findingId: string, picture: string) => {
    uploadPictureMutation.mutate({ findingId, picture });
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Finding</th>
            <th>Picture</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {findingsQuery.data?.map((finding) => (
            <tr key={finding.id}>
              <td>
                <Form.Control
                  value={finding.description}
                  onChange={(e) => findingsMutation.mutate({ ...finding, description: e.target.value })}
                />
              </td>
              <td>
                {finding.picture ? (
                  <Image
                    src={getPocketBaseUrlForImg(finding) ?? ''}
                    alt='No picture'
                    fluid
                    style={{ maxHeight: 200 }}
                  />
                ) : (
                  <CameraModalBtn
                    text='Take picture'
                    onCaptureImage={(image) => handleCaptureImage(finding.id, image)}
                  />
                )}
              </td>
              <td>
                <Button onClick={() => deleteFindingMutation.mutate(finding.id)} variant='danger'>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button onClick={() => createFindingMutation.mutate()}>Create finding</Button>
    </>
  );
};

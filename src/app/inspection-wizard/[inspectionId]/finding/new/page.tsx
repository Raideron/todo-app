'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import PocketBase from 'pocketbase';
import React, { useEffect } from 'react';

import { GET_INSPECTION_KEY, GET_INSPECTIONS_KEY, NEW_FINDING_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';

interface NewFindingPageProps {
  params: {
    inspectionId: string;
  };
}

const NewFindingPage: NextPage<NewFindingPageProps> = (props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  console.log(props);

  const newFindingMutation = useMutation({
    mutationKey: [NEW_FINDING_KEY],
    mutationFn: async () => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const findingResult = await pb.collection('findings').create({});
      console.log({ findingResult });
      const inspectionResult = await pb.collection('inspections').getOne(props.params['inspectionId']);
      console.log({ inspectionResult });
      await pb.collection('inspections').update(props.params['inspectionId'], {
        findingIds: [...inspectionResult.findingIds, findingResult.id],
      });
      return findingResult;
    },
    onSuccess: (data) => {
      router.replace(`/inspection-wizard/${props.params['inspectionId']}/finding/${data.id}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_INSPECTIONS_KEY, GET_INSPECTION_KEY(props.params['inspectionId'])],
      });
    },
  });

  useEffect(() => {
    newFindingMutation.mutate();
  }, []);

  return (
    <>
      <h1>New Inspection</h1>

      {newFindingMutation.isPending && <div>Loading...</div>}

      {newFindingMutation.isError && <div>There was an error creating the inspection</div>}

      {newFindingMutation.isSuccess && <div>Successfully created inspection</div>}
    </>
  );
};

export default NewFindingPage;

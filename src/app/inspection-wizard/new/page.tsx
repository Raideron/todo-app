'use client';

import { useMutation } from '@tanstack/react-query';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import PocketBase from 'pocketbase';
import React, { useEffect } from 'react';

import { NEW_INSPECTION_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';

const NewInspectionPage: NextPage = () => {
  const router = useRouter();

  const newInspectionMutation = useMutation({
    mutationKey: [NEW_INSPECTION_KEY],
    mutationFn: async () => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const result = await pb.collection('inspections').create({});
      return result;
    },
    onSuccess: (data) => {
      router.replace(`/inspection-wizard/${data.id}`);
    },
  });

  useEffect(() => {
    newInspectionMutation.mutate();
  }, []);

  return (
    <>
      <h1>New Inspection</h1>

      {newInspectionMutation.isPending && <div>Loading...</div>}

      {newInspectionMutation.isError && <div>There was an error creating the inspection</div>}

      {newInspectionMutation.isSuccess && <div>Successfully created inspection</div>}
    </>
  );
};

export default NewInspectionPage;

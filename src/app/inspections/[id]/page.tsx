'use client';

import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import PocketBase from 'pocketbase';
import React from 'react';
import { z } from 'zod';

import { GET_INSPECTION_KEY } from '@/api/api-keys';
import { FindingsList } from '@/components/findings-list';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { InspectionSchema } from '@/types/inspection';

interface InspectionDetailPageProps {
  params: {
    id: string;
  };
}

const InspectionDetailPage: NextPage<InspectionDetailPageProps> = (props) => {
  const inspectionId = z.string().parse(props.params.id);

  const inspectionQuery = useQuery({
    queryKey: GET_INSPECTION_KEY(inspectionId),
    queryFn: async () => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const result = await pb.collection('inspections').getOne(inspectionId);
      const parsedInspection = InspectionSchema.parse(result);
      return parsedInspection;
    },
  });

  return (
    <main>
      <h1>Inspection{inspectionQuery.isSuccess && `: ${inspectionQuery.data.name}`}</h1>

      {inspectionQuery.isSuccess && <FindingsList inspection={inspectionQuery.data} />}
    </main>
  );
};

export default InspectionDetailPage;

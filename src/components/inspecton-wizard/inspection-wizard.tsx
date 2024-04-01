'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import PocketBase from 'pocketbase';
import React from 'react';
import { Button, Form } from 'react-bootstrap';

import { GET_INSPECTION_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { InspectionSchema } from '@/types/inspection';

import { FindingsOverview } from '../findings-overview';

interface InspectionWizardProps {
  inspectionId: string;
}

export const InspectionWizard: React.FC<InspectionWizardProps> = (props) => {
  const inspectionQuery = useQuery({
    queryKey: GET_INSPECTION_KEY(props['inspectionId']),
    queryFn: async () => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const result = await pb.collection('inspections').getOne(props['inspectionId']);
      const inspection = InspectionSchema.parse(result);
      return inspection;
    },
  });

  return (
    <div>
      <h1>InspectionWizard</h1>

      <h3>Name: {inspectionQuery.data?.name}</h3>

      <h3>Findings</h3>
      {inspectionQuery.isSuccess && <FindingsOverview inspection={inspectionQuery.data}></FindingsOverview>}

      <Link href={`/inspection-wizard/${props.inspectionId}/finding/new`} passHref>
        <Button>Create new finding</Button>
      </Link>

      {/* TODO */}
      <Button disabled>Export to PDF</Button>
    </div>
  );
};

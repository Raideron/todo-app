'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NextPage } from 'next';
import Link from 'next/link';
import PocketBase from 'pocketbase';
import React from 'react';
import { Button, Table } from 'react-bootstrap';

import { DELETE_INSPECTION_KEY, GET_INSPECTION_KEY, GET_INSPECTIONS_KEY } from '@/api/api-keys';
import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { Inspection, InspectionSchema } from '@/types/inspection';

const InspectionPage: NextPage = () => {
  const queryClient = useQueryClient();

  const inspectionsQuery = useQuery({
    queryKey: [GET_INSPECTIONS_KEY],
    queryFn: async () => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const inspections = await pb.collection('inspections').getFullList();
      const parsedInspections: Inspection[] = inspections.map((x) => InspectionSchema.parse(x));
      return parsedInspections;
    },
  });

  const inspections = inspectionsQuery.data ?? [];

  const deleteInspectionMutation = useMutation({
    mutationKey: [DELETE_INSPECTION_KEY],
    mutationFn: async (inspectionId: string) => {
      const pb = new PocketBase(POCKET_BASE_URL);
      await pb.collection('inspections').delete(inspectionId);
      return inspectionId;
    },
    onSettled: (inspectionId) => {
      queryClient.invalidateQueries({
        queryKey: [GET_INSPECTIONS_KEY],
      });
      if (inspectionId) {
        queryClient.invalidateQueries({
          queryKey: GET_INSPECTION_KEY(inspectionId),
        });
      }
    },
  });

  return (
    <>
      <h1>Inspections Page</h1>

      <Table>
        <thead>
          <tr>
            <th>Inspection ID</th>
            <th>Created</th>
            <th>Name</th>
            <th>Findings</th>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {inspections.map((inspection) => (
            <tr key={inspection.id}>
              <td>{inspection.id}</td>
              <td>{inspection.created.toString()}</td>
              <td>{inspection.name}</td>
              <td>{inspection.findingIds.length}</td>
              <td>
                <Link href={`/inspections/${inspection.id}`}>
                  <Button>Open inspection</Button>
                </Link>
              </td>
              <td>
                <Link href={`/inspection-wizard/${inspection.id}`}>
                  <Button>Open inspection wizard</Button>
                </Link>
              </td>
              <td>
                <Button onClick={() => deleteInspectionMutation.mutate(inspection.id)} variant='danger'>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default InspectionPage;

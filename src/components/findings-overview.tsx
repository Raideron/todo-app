'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import PocketBase from 'pocketbase';
import React from 'react';
import { Button, Image, Table } from 'react-bootstrap';

import { POCKET_BASE_URL } from '@/constants/pocketbase';
import { useGetFindings } from '@/hooks/useGetFindings';
import { useUpdateFinding } from '@/hooks/useUpdateFinding';
import { Finding } from '@/types/finding';
import { Inspection } from '@/types/inspection';

interface FindingsOverviewProps {
  inspection: Inspection;
}

/** Read-only list of findings for an inspection */
export const FindingsOverview: React.FC<FindingsOverviewProps> = (props) => {
  const findingsCollectionKey = useQuery({
    queryKey: ['findingsCollectionId'],
    queryFn: async () => {
      const pb = new PocketBase(POCKET_BASE_URL);
      const collectionId = pb.collection('findings').collectionIdOrName;
      return collectionId;
    },
  });

  const findingsQuery = useGetFindings(props.inspection.id);

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

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Finding</th>
          <th>Picture</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {findingsQuery.data.map((finding) => (
          <tr key={finding.id}>
            <td>{finding.description}</td>

            <td>
              {!!finding.picture && (
                <Image src={getPocketBaseUrlForImg(finding) ?? ''} alt='No picture' fluid style={{ maxHeight: 200 }} />
              )}
            </td>

            <td>
              <Link href={`/inspection-wizard/${props.inspection.id}/finding/${finding.id}`} passHref>
                <Button>Edit</Button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

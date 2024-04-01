'use client';

import Link from 'next/link';
import React from 'react';
import { Button, Image } from 'react-bootstrap';

import { useGetFinding } from '@/hooks/useGetFinding';
import { useGetPocketBaseImgUrl } from '@/hooks/useGetPocketBaseImgUrl';
import { useUpdateFinding } from '@/hooks/useUpdateFinding';
import { useUpdateImage } from '@/hooks/useUpdateImage';

import { CameraModalBtn } from '../camera-modal';

interface FindingWizardProps {
  inspectionId: string;
  findingId: string;
}

export const FindingWizard: React.FC<FindingWizardProps> = (props) => {
  const findingQuery = useGetFinding(props.findingId);
  const finding = findingQuery.data;
  const updateFindingMutation = useUpdateFinding(props.findingId);
  const getPocketBaseUrlForImg = useGetPocketBaseImgUrl();
  const updateImageMutation = useUpdateImage(props.inspectionId);

  return (
    <div>
      <Link href={`/inspection-wizard/${props.inspectionId}`} passHref>
        <Button>{`< To inspection`}</Button>
      </Link>

      <h1>FindingPage: {props.findingId}</h1>

      <pre>{JSON.stringify(findingQuery.data, null, 2)}</pre>

      {!!finding && (
        <>
          <textarea
            value={finding.description}
            onChange={(e) => updateFindingMutation.mutate({ ...finding, description: e.target.value })}
          />

          <CameraModalBtn
            text={'Take picture'}
            onCaptureImage={(picture) => {
              updateImageMutation.mutate({ findingId: props.findingId, picture });
            }}
          ></CameraModalBtn>

          {!!finding.picture && (
            <Image
              src={getPocketBaseUrlForImg(finding) ?? ''}
              alt={'No picture'}
              fluid
              style={{ maxHeight: 200 }}
            ></Image>
          )}

          <Link href={`/inspection-wizard/${props.inspectionId}/finding/new`} passHref>
            <Button>Create a new finding</Button>
          </Link>
        </>
      )}
    </div>
  );
};

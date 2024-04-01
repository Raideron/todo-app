import { NextPage } from 'next';
import React from 'react';

import { FindingWizard } from '@/components/inspecton-wizard/finding-wizard';

interface FindingPageProps {
  params: {
    inspectionId: string;
    findingId: string;
  };
}

const FindingPage: NextPage<FindingPageProps> = (props) => (
  <FindingWizard inspectionId={props.params.inspectionId} findingId={props.params.findingId}></FindingWizard>
);
export default FindingPage;

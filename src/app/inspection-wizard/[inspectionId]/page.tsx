import { NextPage } from 'next';
import React from 'react';

import { InspectionWizard } from '@/components/inspecton-wizard/inspection-wizard';

interface InspectionWizardPageProps {
  params: {
    inspectionId: string;
  };
}

const InspectionWizardPage: NextPage<InspectionWizardPageProps> = (props) => (
  <InspectionWizard inspectionId={props.params.inspectionId}></InspectionWizard>
);

export default InspectionWizardPage;

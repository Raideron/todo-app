export const DELETE_INSPECTION_KEY = 'DELETE_INSPECTION' as const;
export const GET_FINDING_KEY = (findingId: string) => ['GET_FINDING', findingId] as const;
export const GET_FINDINGS_KEY = (findingIds: string[]) => ['GET_FINDINGS', ...findingIds] as const;
export const GET_INSPECTION_KEY = (inspectionId: string) => ['GET_INSPECTION', inspectionId] as const;
export const GET_INSPECTIONS_KEY = 'GET_INSPECTIONS' as const;
export const NEW_FINDING_KEY = 'NEW_FINDING' as const;
export const NEW_INSPECTION_KEY = 'NEW_INSPECTION' as const;

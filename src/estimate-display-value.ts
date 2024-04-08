export const getEstimateConvertedNumber = (estimateInHours: number, unit: 'h' | 'm'): number => {
  if (unit === 'm') {
    return estimateInHours * 60;
  }

  return estimateInHours;
};

export const getEstimateDisplayValue = (estimateInHours: number, unit: 'h' | 'm'): string =>
  `${getEstimateConvertedNumber(estimateInHours, unit)}${unit}`;

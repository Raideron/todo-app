import { getEstimateConvertedNumber, getEstimateDisplayValue } from './estimate-display-value';

describe('estimateDisplayValue', () => {
  it('should return the correct value for hours', () => {
    expect(getEstimateDisplayValue(100, 'h')).toBe('100h');
    expect(getEstimateDisplayValue(1.5, 'h')).toBe('1.5h');
    expect(getEstimateDisplayValue(0, 'h')).toBe('0h');
    expect(getEstimateDisplayValue(0.5, 'h')).toBe('0.5h');
  });

  it('should return the correct value for minutes', () => {
    expect(getEstimateDisplayValue(100, 'm')).toBe('6000m');
    expect(getEstimateDisplayValue(1.5, 'm')).toBe('90m');
    expect(getEstimateDisplayValue(0, 'm')).toBe('0m');
    expect(getEstimateDisplayValue(0.5, 'm')).toBe('30m');
  });
});

describe('getEstimateConvertedNumber', () => {
  it('should return the correct value', () => {
    expect(getEstimateConvertedNumber(100, 'h')).toBe(100);
  });
});

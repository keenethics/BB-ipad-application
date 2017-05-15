export interface IRangeValue {
  lower: number;
  upper: number;
};

export interface IRange {
  max: number;
  min: number;
  value: IRangeValue;
};

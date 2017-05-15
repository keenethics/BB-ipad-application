export interface IFilter<P, R> {
  // ?????
  use(payload: P): R;
}

export interface ICalculationFilter<P> extends IFilter<P, any[]> {
  calc(data: any[]): any[];
}

export interface ISelectionFilter<P> extends IFilter<P, any> {
  getQuery(): any;
}

export abstract class CalculationFilter { }

export abstract class SelectionFilter { }

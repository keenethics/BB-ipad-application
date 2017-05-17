import { BusinessDataUnit } from '../../../../both/data-management';

export interface IState<P, S> {
  setState(state: P): void;
  getState(): S;
  reset(): void;
}

export interface ICalculation<P, S> extends IState<P, S> {
  calc(data: BusinessDataUnit[], params?: P): BusinessDataUnit[];
}

export interface ISelection<P, S> extends IState<P, S> {
  getQuery(params?: P): any;
}

export type TFilter = ICalculation<any, any> | ISelection<any, any>;

export abstract class Calculation { }

export abstract class Selection { }

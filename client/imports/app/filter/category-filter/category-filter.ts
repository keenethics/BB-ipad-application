import { Injectable } from '@angular/core';
import { Selection, ISelection } from '../abstarct';

@Injectable()
export class CategoryFilter extends Selection implements ISelection<string, { identifier: string }> {
  private _state = 'Global';

  constructor() {
    super();
  }

  setState(v: string) {
    this._state = v;
  }

  getState() {
    return {
      identifier: this._state
    };
  }

  getQuery() {
    return { identifier: this._state };
  }

  initState(state: any) {
    this._state = state;
  }

  reset() {
    this._state = 'Global';
  }
}

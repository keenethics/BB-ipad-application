import { Injectable } from '@angular/core';
import { Selection, ISelection } from '../abstarct';

import { BusinessDataUnit } from '../../../../../both/data-management';

@Injectable()
export class BuFilterSelect extends Selection implements ISelection<{ unitsTitles: string[] }, { businessUnits: string[] }> {
  private _state: any[] = ['Total'];

  constructor() {
    super();
  }

  setState({ unitsTitles }: { unitsTitles: string[] }) {
    this._state = makeState(unitsTitles);
  }

  getState() {
    return {
      businessUnits: this._state
    };
  }

  getQuery() {
    return {
      n2: { $in: this._state }
    };
  }
}

function makeState(selections: string[]) {
  if (selections.length === 10) return ['Total'];

  if (selections.indexOf('Total') !== -1 && selections.length > 1) {
    return selections.filter(t => t !== 'Total');
  }

  return selections;
}

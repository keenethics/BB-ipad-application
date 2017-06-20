import { Injectable } from '@angular/core';
import { Selection, ISelection } from '../abstarct';

import { ISelectedPlace, IPlaceFilterPayload } from './selected-place.interface';
import { BusinessDataUnit } from '../../../../../both/data-management';

@Injectable()
export class PlacesFilter extends Selection implements ISelection<any, {}> {
  private _state: ISelectedPlace[] = [];

  constructor() {
    super();
  }

  setState(payload: {
    label: string,
    category: string,
    data: BusinessDataUnit[]
  }) {
    if (!isInState(payload.label, this._state)) {
      this._state = addPlace(payload, this._state);
    } else {
      this._state = removePlace(payload.label, this._state);
    }
  }

  getState() {
    return {
      places: this._state
    };
  }

  getQuery() {
    return this._state.reduce((query: any, item) => {
      const queryField = query[item.category.toLowerCase()];

      if (queryField && queryField.$in) {
        queryField.$in.push(item.label);
        return query;
      }

      query[item.category.toLowerCase()] = { $in: [item.label], $nin: ['Non Nokia Site', 'Virtual Office'] };
      return query;
    }, { city: { $nin: ['Non Nokia Site', 'Virtual Office'] } });
  }

  reset() {
    this._state = [];
  }
}

function addPlace({ label, category, data }: IPlaceFilterPayload, state: ISelectedPlace[]) {
  const unit = data.find(u => u[category.toLowerCase()] === label);
  const place = { label, category, unit };
  return [...state, place];
}

function removePlace(label: string, state: ISelectedPlace[]) {
  return state.filter(p => {
    return (p.label !== label) && (p.unit.market !== label) && (p.unit.country !== label);
  });
}

function isInState(label: string, state: ISelectedPlace[]) {
  return !!state.filter(p => p.label === label).length;
}

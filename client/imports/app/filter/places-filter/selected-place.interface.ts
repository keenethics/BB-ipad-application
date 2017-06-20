import { BusinessDataUnit } from '../../../../../both/data-management';

export interface ISelectedPlace {
  label: string;
  category: string;
  unit: BusinessDataUnit;
}

export interface IPlaceFilterPayload {
  label: string;
  category: string;
  data: BusinessDataUnit[];
}

import { Mongo } from 'meteor/mongo';

export const ColumnNamesCollection = new Mongo.Collection<ColumnNames>('column-names');

export interface ColumnNames {
  _id: string;
  n1: string;
  n2: string;
  n3: string;
  market: string;
  country: string;
  city: string;
  resourceType: string;
  hcLc: string;
  hcCategory: string;
  latitude: string;
  longitude: string;
  period: string;
  value: string;
}

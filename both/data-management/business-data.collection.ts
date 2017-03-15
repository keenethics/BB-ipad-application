import { Mongo } from 'meteor/mongo';

export const BusinessData = new Mongo.Collection<BusinessDataUnit>('business-data');

export interface BusinessDataUnit {
  _id: string;
  n1: string;
  n2: string;
  n3: string;
  market: string;
  country: string;
  city: string;
  metropolis: string;
  resourceType: string;
  hcLc: string;
  highLevelCategory: string;
  latitude: number;
  longitude: number;
  periods: any;
  identifier: string;
}

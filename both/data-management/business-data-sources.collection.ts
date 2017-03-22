import { Mongo } from 'meteor/mongo';
import { BusinessDataUnit } from './business-data.collection';

export const BusinessDataSources = new Mongo.Collection<BusinessDataUnit>('business-data-sources');

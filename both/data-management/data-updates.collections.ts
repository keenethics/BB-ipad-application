import { Mongo } from 'meteor/mongo';

export const DataUpdates = new Mongo.Collection<any>('data-updates');

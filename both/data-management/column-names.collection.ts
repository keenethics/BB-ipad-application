import { Mongo } from 'meteor/mongo';

export const ColumnNamesCollection = new Mongo.Collection<any>('column-names');

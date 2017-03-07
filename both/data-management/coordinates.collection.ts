import { Mongo } from 'meteor/mongo';

export const GeoCoordinates = new Mongo.Collection<any>('geo-coordinates');

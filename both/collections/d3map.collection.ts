import { MongoObservable } from 'meteor-rxjs';
import { D3Map } from '../models/d3map.model';
export const D3Maps = new MongoObservable.Collection('d3map');

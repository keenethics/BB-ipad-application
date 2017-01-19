import * as _ from 'lodash';
import { BusinessDataUnit } from './business-data.collection';

export function markets(data: BusinessDataUnit[]) {
  return _(data)
    .filter(item => item.market !== 'Total')
    .groupBy(item => item.market);
};

export function cities() {

}

export function countries() {

}

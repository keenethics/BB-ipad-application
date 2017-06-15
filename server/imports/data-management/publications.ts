import { Meteor } from 'meteor/meteor';
import { BusinessData, ColumnNamesCollection, UnitsTitles, DataUpdates } from '../../../both/data-management';

Meteor.publish('businessData', function (query: Object, projection: any) {
  if (!this.userId) return this.ready();
  if (projection) {
    return BusinessData.find(query, projection);
  }
  return BusinessData.find(query);
});

Meteor.publish('columnNames', function () {
  if (!this.userId) return this.ready();
  return ColumnNamesCollection.find({});
});

Meteor.publish('unitsTitles', function () {
  if (!this.userId) return this.ready();
  return UnitsTitles.find({});
});

Meteor.publish('dataUpdates', function () {
  if (!this.userId) return this.ready();
  return DataUpdates.find({});
});

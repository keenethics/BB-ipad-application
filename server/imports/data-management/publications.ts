import { Meteor } from 'meteor/meteor';
import { BusinessData, ColumnNamesCollection, UnitsTitles, DataUpdates } from '../../../both/data-management';

Meteor.publish('businessData', function (query: Object, projection: any) {
    if (typeof query !== 'object' ||
        Object.getOwnPropertyNames(query).length === 0) {
        return this.ready();
    }
    if (projection) {
        return BusinessData.find(query, projection);
    } else {
        return BusinessData.find(query);
    }
});

Meteor.publish('columnNames', function () {
    return ColumnNamesCollection.find({});
});

Meteor.publish('unitsTitles', function () {
    return UnitsTitles.find({});
});

Meteor.publish('dataUpdates', function() {
    return DataUpdates.find({});
});

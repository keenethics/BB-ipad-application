import { Meteor } from 'meteor/meteor';
import { BusinessData, ColumnNamesCollection, UnitsTitles, DataUpdates } from '../../../both/data-management';

Meteor.publish('businessData', function (query: Object, projection: any) {
    const self = this;
    if (typeof query !== 'object' ||
        Object.getOwnPropertyNames(query).length === 0) {
        return this.ready();
    }
    if (projection) {
        BusinessData.find().forEach(function (doc: any) {
            self.added('business-data', doc._id._str, doc);
        });
        return self.ready();
    } else {
        BusinessData.find().forEach(function (doc: any) {
            self.added('business-data', doc._id._str, doc);
        });
        return self.ready();
        // return BusinessData.find(query);
    }
});

Meteor.publish('columnNames', function () {
    return ColumnNamesCollection.find({});
});

Meteor.publish('unitsTitles', function () {
    return UnitsTitles.find({});
});

Meteor.publish('dataUpdates', function () {
    return DataUpdates.find({});
});

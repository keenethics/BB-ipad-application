import { Meteor } from 'meteor/meteor';
import { BusinessData, ColumnNamesCollection } from '../../../both/data-management';

Meteor.publish('businessData', function (query: Object) {
    if (typeof query !== 'object' ||
        Object.getOwnPropertyNames(query).length === 0) {
        return this.ready();
    }

    return BusinessData.find(query);
});

Meteor.publish('columnNames', function () {
    return ColumnNamesCollection.find({});
});

import { Meteor } from 'meteor/meteor';
import { BusinessData, ColumnNamesCollection } from '../../../both/data-management';

Meteor.publish('allData', function() {
    return BusinessData.find({});
});

Meteor.publish('columnNames', function() {
    return ColumnNamesCollection.find({});
});

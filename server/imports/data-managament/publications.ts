import { Meteor } from 'meteor/meteor';
import { Data } from '../../../both/data-managament/data.collection';

Meteor.publish('allData', function() {
    return Data.find({});
});

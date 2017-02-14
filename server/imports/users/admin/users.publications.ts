import { Meteor } from 'meteor/meteor';

Meteor.publish('allUsers', function (userId: string) {
  if (Roles.userIsInRole(userId, 'Administrator')) {
    return Meteor.users.find({});
  }

  return this.ready();
});

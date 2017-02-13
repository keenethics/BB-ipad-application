import { Meteor } from 'meteor/meteor';

Meteor.users.allow({
  update: (userId: string, user: Meteor.User) => {
    return Roles.userIsInRole(userId, 'Administrator');
  },
  insert: (userId: string, user: Meteor.User) => {
    return Roles.userIsInRole(userId, 'Administrator');
  },
  remove: (userId: string, user: Meteor.User) => {
    return Roles.userIsInRole(userId, 'Administrator');
  }
});

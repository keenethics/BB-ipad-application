import { Meteor } from 'meteor/meteor';

Meteor.publish('allUsers', function (userId: string) {
  if (!this.userId) return this.ready();

  if (!Roles.userIsInRole(userId, 'Administrator')) return this.ready();

  return Meteor.users.find({});
});

Meteor.publish('users', function (userId: string, skip: number, limit: number) {
  if (!this.userId) return this.ready();

  if (!Roles.userIsInRole(userId, 'Administrator')) return this.ready();

  return Meteor.users.find({}, { skip, limit });
});

import { Meteor } from 'meteor/meteor';

Meteor.publish('allUsers', function (userId: string) {
  if (Roles.userIsInRole(userId, 'Administrator')) {
    return Meteor.users.find({});
  }

  return this.ready();
});

Meteor.publish('users', function (userId: string, skip: number, limit: number) {
  if (Roles.userIsInRole(userId, 'Administrator')) {
    const users = Meteor.users.find({}, { skip, limit });
    return users;
  }

  return this.ready();
});

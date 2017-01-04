import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

export const createUser = new ValidatedMethod({
  name: 'auth.create-user',
  validate: new SimpleSchema({
    email: { type: String },
    password: { type: String },
    roleId: { type: String }
  }).validator(),
  run({ email, password, roleId }) {
    if (!this.userId) {
      throw new Meteor.Error('premission denied', 'Please login first.');
    }

    if (!Roles.userIsInRole(this.userId, 'Administrator')) {
      throw new Meteor.Error('premission denied', 'You are not an Administrator.');
    }

    const userId = Accounts.createUser({ email, password });

    let existRole;
    Roles.getAllRoles().forEach((item: any) => {
      if (item._id === roleId) { existRole = item.name; };
    });

    if (userId) {
      if (existRole) {
        Roles.addUsersToRoles(userId, existRole);
      } else {
        Roles.addUsersToRoles(userId, 'User');
        return 'Created user with role: "User".';
      }
    }

    return 'User created successfully';
  }
});

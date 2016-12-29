import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

export const signup = new ValidatedMethod({
  name: 'auth.signup',
  validate: new SimpleSchema({
    email: { type: String },
    password: { type: String }
  }).validator(),
  run({ email, password }) {
    if (this.userId) {
      const message = 'You are logged in already.';
      throw new Meteor.Error(message, message);
    }

    const userId = Accounts.createUser({ email, password });
    if (userId) {
      Roles.addUsersToRoles(userId, 'user');
    }

    return 'User created';
  }
});

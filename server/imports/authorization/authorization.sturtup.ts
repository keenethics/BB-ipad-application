import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    const userId = Accounts.createUser({
      username: 'admin',
      email: 'admin@mail.com',
      password: '111111'
    });

    Roles.addUsersToRoles(userId, 'Administrator');
  }
});

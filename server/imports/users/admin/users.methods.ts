import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { getEmailRegExp } from '../../../../both/helpers';

export const createUser = new ValidatedMethod({
  name: 'users.create',
  validate: new SimpleSchema({
    email: { type: String },
    password: { type: String },
    roleId: { type: String }
  }).validator(),
  run({ email, password, roleId }) {
    if (!this.userId) {
      throw new Meteor.Error('permission denied', 'Please login first.');
    }

    if (!Roles.userIsInRole(this.userId, 'Administrator')) {
      throw new Meteor.Error('permission denied', 'You are not an Administrator.');
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

export const updateUser = new ValidatedMethod({
  name: 'users.update',
  validate: new SimpleSchema({
    userId: { type: String },
    email: { type: String },
    password: { type: String },
    roleId: { type: String }
  }).validator(),
  run({ userId, email, password, roleId }) {
    if (!this.userId) {
      throw new Meteor.Error('permission denied', 'Please login first.');
    }

    if (!Roles.userIsInRole(this.userId, 'Administrator')) {
      throw new Meteor.Error('permission denied', 'You are not an Administrator.');
    }

    const user = Meteor.users.findOne(userId);
    if (!user) throw new Meteor.Error('user doesn\'t exist', 'User doesn\'t exist');

    if (!getEmailRegExp().test(email)) throw new Meteor.Error('email is not valid', 'Email is not valid');

    if (password.length < 6) throw new Meteor.Error('password must contain minimum 6 symbols', 'Password must contain minimum 6 symbols');

    const role = Meteor.roles.findOne(roleId);
    if (!role) throw new Meteor.Error('role doesn\'t exist', 'Role doesn\'t exist');
    if (!Roles.userIsInRole(userId, role)) {
      Roles.removeUsersFromRoles(userId, [
        'Administrator',
        'User',
        'DataUpload'
      ]);

      Roles.addUsersToRoles(userId, role.name);
    }

    Accounts.setPassword(userId, password, { logout: false });

    Meteor.users.update({ _id: user._id },
      {
        $set: {
          emails: [
            {
              address: email,
              verified: user.emails[0].verified
            }
          ]
        }
      });

    return 'User updated successfully';
  }
});

export const removeUser = new ValidatedMethod({
  name: 'users.remove',
  validate: new SimpleSchema({
    userId: { type: String }
  }).validator(),
  run({ userId }) {
    if (!this.userId) {
      throw new Meteor.Error('permission denied', 'Please login first.');
    }

    if (!Roles.userIsInRole(this.userId, 'Administrator')) {
      throw new Meteor.Error('permission denied', 'You are not an Administrator.');
    }

    if (this.userId === userId) {
      throw new Meteor.Error('permission denied', 'You can\'t delete this user.');
    }

    const user = Meteor.users.findOne(userId);
    if (!user) throw new Meteor.Error('user doesn\'t exist', 'User doesn\'t exist');

    Meteor.users.remove(userId);

    return `User ${userId} removed successfully`;
  }
});

export const addUsers = new ValidatedMethod({
  name: 'users.addTestUsers',
  validate: new SimpleSchema({
    count: { type: Number }
  }).validator(),
  run({ count }) {
    for (let i = 0; i < count; i++) {
      const userId = Accounts.createUser({ email: `user${i}@mail.com`, password: '111111' });
      console.log(userId);
      Roles.addUsersToRoles(userId, 'User');
    }
    return `Added ${count} users`;
  }
});

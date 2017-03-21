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
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    if (!Roles.userIsInRole(this.userId, 'Administrator')) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
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
        return 'default_user_created';
      }
    }

    return 'user_created';
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
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    if (!Roles.userIsInRole(this.userId, 'Administrator')) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    const user = Meteor.users.findOne(userId);
    if (!user) throw new Meteor.Error('no_user', 'no_user');

    if (!getEmailRegExp().test(email)) throw new Meteor.Error('email_invalid', 'email_invalid');

    if (password.length < 6) throw new Meteor.Error('password_invalid_min_length', 'password_invalid_min_length');

    const role = Meteor.roles.findOne(roleId);
    if (!role) throw new Meteor.Error('no_role', 'no_role');
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

    return 'user_updated';
  }
});

export const removeUser = new ValidatedMethod({
  name: 'users.remove',
  validate: new SimpleSchema({
    userId: { type: String }
  }).validator(),
  run({ userId }) {
    if (!this.userId) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    if (!Roles.userIsInRole(this.userId, 'Administrator')) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    if (this.userId === userId) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    const user = Meteor.users.findOne(userId);
    if (!user) throw new Meteor.Error('no_user', 'no_user');

    Meteor.users.remove(userId);

    return 'user_removed';
  }
});

// export const addUsers = new ValidatedMethod({
//   name: 'users.addTestUsers',
//   validate: new SimpleSchema({
//     count: { type: Number }
//   }).validator(),
//   run({ count }) {
//     for (let i = 0; i < count; i++) {
//       const userId = Accounts.createUser({ email: `user${i}@mail.com`, password: '111111' });
//       console.log(userId);
//       Roles.addUsersToRoles(userId, 'User');
//     }
//     return `Added ${count} users`;
//   }
// });

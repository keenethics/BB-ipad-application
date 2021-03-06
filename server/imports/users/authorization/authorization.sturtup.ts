import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  registerLoginHooks();

  if (Meteor.users.find().count() === 0) {
    const userId = Accounts.createUser({
      username: 'admin',
      email: 'admin@mail.com',
      password: '111111'
    });

    Roles.addUsersToRoles(userId, 'Administrator');
  }
});

function registerLoginHooks() {
  Accounts.onLogin(() => {
    incUserLogins(Meteor.userId());
  });

  Accounts.onLoginFailure((err: any) => {
    incUserFailedLogins(err.user && err.user._id);
  });
}


function incUserLogins(userId: string) {
  if (!userId) return;

  Meteor.users.update(userId, {
    $inc: { 'profile.logins': 1 },
    $currentDate: { 'profile.lastLoginDate': true },
    $set: { 'profile.failedLogins': 0 }
  });
}

function incUserFailedLogins(userId: string) {
  if (!userId) return;

  Meteor.users.update(userId, {
    $inc: { 'profile.failedLogins': 1 },
    $currentDate: { 'profile.lastFailedLoginDate': true }
  });
}

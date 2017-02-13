import { Meteor } from 'meteor/meteor';

import './imports/users';
import './imports/data-management';

Meteor.startup(() => {
  Accounts.config({
    forbidClientAccountCreation: false
  });
});

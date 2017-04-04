import { Meteor } from 'meteor/meteor';

import './imports/users';
import './imports/data-management';
import './imports/countries';
import './imports/info';

Meteor.startup(() => {
  Accounts.config({
    forbidClientAccountCreation: false
  });
});

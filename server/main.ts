import { Meteor } from 'meteor/meteor';

import './imports/authorization';
import './imports/data-management';

Meteor.startup(() => {
  Accounts.config({
    forbidClientAccountCreation: false
  });
});

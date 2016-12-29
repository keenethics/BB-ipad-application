import { Meteor } from 'meteor/meteor';
import { loadD3Map } from './imports/fixtures/d3map.fixtures';
import { loadUser } from './imports/fixtures/users.fixtures';

import './imports/methods/d3map.methods';

import './imports/roles';
import './imports/authorization';

Meteor.startup(() => {
  Accounts.config({
    forbidClientAccountCreation: false
  });
  loadD3Map();
  loadUser();
});

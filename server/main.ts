import { Meteor } from 'meteor/meteor';
import { loadD3Map } from './imports/fixtures/d3map.fixtures';
import { loadUser } from './imports/fixtures/users.fixtures';

import './imports/methods/d3map.methods';
import './imports/methods/users.methods';

Meteor.startup(() => {
  Accounts.config({
    forbidClientAccountCreation : true
  });
  loadD3Map()
  loadUser()
});
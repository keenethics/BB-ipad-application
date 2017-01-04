import { Meteor } from 'meteor/meteor';
import { loadD3Map } from './imports/fixtures/d3map.fixtures';

import './imports/methods/d3map.methods';

import './imports/authorization';
import './imports/data-management';

Meteor.startup(() => {
  Accounts.config({
    forbidClientAccountCreation: false
  });
  loadD3Map();
});

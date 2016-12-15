import { MongoObservable } from 'meteor-rxjs';
import {Meteor} from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

export function loadUser() {
  if ( Meteor.users.find().count() === 0 ) {
    Accounts.createUser({
      username: 'admin',
      email: 'admin@admin.com',
      password: 'passw0rd'
    });
  }
}
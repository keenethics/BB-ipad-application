import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'underscore';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  create_user: function (name, emailId, password, role) {

    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');
    if (user.role !== 'Administrator') {
      throw new Meteor.Error('403', 'No permissions!');
    }
    
    id = Accounts.createUser({
      email: emailId,
      password: password,
      profile: { name: name }
    })

    Meteor.users.update({_id: id}, {$set: {"role": role}});
    return id
  },
  users_list: function(){
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');
    return Meteor.users.find({'username': {'$ne': 'admin'}},{fields: { 'profile.name': 1, username: 1, 'emails.address': 1, 'role': 1}}).fetch()
  },
  save_users: function(users){
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');
    if (user.role !== 'Administrator') {
      throw new Meteor.Error('403', 'No permissions!');
    }
    _.each(users, function(user){
      if(user._id && _.contains(['Administrator','Customer'], user.role)) {
        Meteor.users.update({_id: user._id}, {$set: {"role": user.role}});
      }
    })
  }
})
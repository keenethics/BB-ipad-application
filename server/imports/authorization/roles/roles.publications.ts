import { Meteor } from 'meteor/meteor';

Meteor.publish(null, function (){
  return (Meteor as any).roles.find({});
});

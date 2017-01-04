import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  if ((Meteor as any).roles.find({}).count() === 0) {
    const ROLES = [
      'Administrator',
      'User',
      'DataUpload'
    ];

    ROLES.forEach((role) => {
      try {
        Roles.createRole(role);
      } catch (err) {
        console.log(`Role: ${role} cannot be created.`);
      }
    });
  }
});

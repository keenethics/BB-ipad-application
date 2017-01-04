import { Meteor } from 'meteor/meteor';
import { Data } from '../../../both/data-management/data.collection';
import * as Baby from '../../../node_modules/babyparse/babyparse.js';

export const uploadFile = new ValidatedMethod({
  name: 'data.upload',
  validate: new SimpleSchema({
    fileData: { type: String },
  }).validator(),
  run({ fileData }) {
    if (!this.userId) {
      throw new Meteor.Error('premission denied', 'Please login first.');
    }

    if (!Roles.userIsInRole(this.userId, 'DataUpload')) {
      throw new Meteor.Error('premission denied', 'You are not a data manager.');
    }

    const parsedData = (Baby as any).parse(fileData).data;

    const keys: string[] = parsedData[0];

    parsedData.forEach((item: string[], index: number) => {
      if (index !== 0) {
        const doc = {};
        keys.forEach((key, i) => {
          doc[key] = item[i];
        });
        Data.insert(doc);
      }
    });

    return 'Data uploaded!';
  }
});

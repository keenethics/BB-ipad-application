import { Meteor } from 'meteor/meteor';
import * as Baby from 'babyparse';
import { toCamelCase } from '../../../both/helpers/to-camel-case';

import {
  BusinessData,
  BusinessDataUnit,
  ColumnNames,
  ColumnNamesCollection
} from '../../../both/data-management';

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

    const parsedData = Baby.parse(fileData).data;
    const keys: string[] = parsedData[0];

    const columnNames = {} as ColumnNames;
    keys.forEach((key) => {
      columnNames[toCamelCase(key.toLowerCase())] = key;
    });
    ColumnNamesCollection.update({}, columnNames, { upsert: true });

    parsedData.forEach((item: string[], index: number) => {
      if (index !== 0) {
        const doc = {} as BusinessDataUnit;
        keys.forEach((key, i) => {
          doc[toCamelCase(key.toLowerCase())] = item[i];
        });
        BusinessData.insert(doc);
      }
    });

    return 'Data uploaded!';
  }
});

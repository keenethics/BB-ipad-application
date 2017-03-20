import { Meteor } from 'meteor/meteor';
import { exec } from 'child_process';
import * as Fiber from 'fibers';
import * as fs from 'fs';
import * as Baby from 'babyparse';
import { toCamelCase } from '../../../both/helpers/to-camel-case';
import { MarketCountries } from '../../../both/countries/market-countries.collection';
import { AvailableCountries } from '../../../both/countries/available-countries.collection';
import { setMarketCountries, setAvailableCountries } from '../../../both/countries/helpers';
import { DataUpdates } from '../../../both/data-management/data-updates.collections';

import {
  BusinessData,
  BusinessDataUnit,
  ColumnNamesCollection,
  UnitsTitles,
  GeoCoordinates,
  BusinessDataSources
} from '../../../both/data-management';

declare const process: any;

export const uploadFile = new ValidatedMethod({
  name: 'data.upload',
  validate: new SimpleSchema({
    fileData: { type: String },
  }).validator(),
  run({ fileData }) {
    if (!this.userId) {
      throw new Meteor.Error('premission denied', 'Please login first.');
    }

    if (!Roles.userIsInRole(this.userId, ['DataUpload', 'Administrator'])) {
      throw new Meteor.Error('premission denied', 'You are not a data manager.');
    }

    if (!GeoCoordinates.find({}).count()) {
      throw new Meteor.Error('no coordinates', 'Please upload geo coordinates first.');
    }


    const tempFileURI = '../../../../../.async-scripts/temp';
    const mongoUrl = process.env.MONGO_URL;

    if (fs.existsSync(tempFileURI)) throw new Meteor.Error('data uploading in process', 'Data uploading in process.');

    fs.writeFile(tempFileURI, fileData, function (err: any) {
      if (err) throw new Meteor.Error(err.message, 'Can\'t wtite temp file.');
      console.log('Data saved to the temp file.');
      console.time();

      exec(`node ../../../../../.async-scripts/save-data.js ${mongoUrl}`, function (err: any, stdout: any, strerr: any) {
        if (err) throw new Meteor.Error(err.message, err.message);
        Fiber(() => {
          const titles = (BusinessData as any)
            .aggregate([{ $group: { _id: null, titles: { $addToSet: '$n2' } } }])[0]
            .titles as string[];
          UnitsTitles.remove({});
          titles.forEach(t => UnitsTitles.insert({ title: t }));

          MarketCountries.remove({});
          AvailableCountries.remove({});

          setMarketCountries();
          setAvailableCountries();

          console.log('Data uploaded');
          console.timeEnd();

          DataUpdates.update({}, { lastDataUpdateDate: new Date() }, { upsert: true });
        }).run();
      });
    });

    return 'You will be notified about data update status in few minutes.';
  }
});

export const uploadCoordinates = new ValidatedMethod({
  name: 'data.uploadCoordinates',
  validate: new SimpleSchema({
    fileData: { type: String },
  }).validator(),
  run({ fileData }) {
    if (!this.userId) {
      throw new Meteor.Error('premission denied', 'Please login first.');
    }

    if (!Roles.userIsInRole(this.userId, ['DataUpload', 'Administrator'])) {
      throw new Meteor.Error('premission denied', 'You are not a data manager.');
    }

    const parsedData = Baby.parse(fileData, { skipEmptyLines: true, delimiter: ';' }).data;
    const keys: string[] = parsedData[0];

    GeoCoordinates.remove({});

    parsedData.forEach((item: string[], index: number) => {
      if (index !== 0) {
        const doc = {} as any;
        keys.forEach((key, i) => {
          doc[toCamelCase(key.toLowerCase())] = item[i];
        });
        GeoCoordinates.insert(doc);
      }
    });

    return 'Coordinates uploaded!';
  }
});

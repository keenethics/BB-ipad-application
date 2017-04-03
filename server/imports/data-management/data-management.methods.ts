import { Meteor } from 'meteor/meteor';
import { exec, fork } from 'child_process';
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
declare const __dirname: string;

export const uploadFile = new ValidatedMethod({
  name: 'data.upload',
  validate: new SimpleSchema({
    current: { type: String },
    hist: { type: String }
  }).validator(),
  run({ current, hist }) {
    if (!current || !hist) {
      throw new Meteor.Error('wrong_upload_params', 'wrong_upload_params');
    }

    if (!this.userId) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    if (!Roles.userIsInRole(this.userId, ['DataUpload', 'Administrator'])) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    if (!GeoCoordinates.find({}).count()) {
      throw new Meteor.Error('no coordinates', 'no_coordinates');
    }

    const rootPath = (Meteor as any).rootPath;
    const absoluteFilePath = Assets.absoluteFilePath('save-data.js');
    const assetsPath = absoluteFilePath.substring(0, absoluteFilePath.indexOf('save-data.js'));
    const babyparseLinkCommand = `${rootPath}/npm/node_modules/babyparse ${assetsPath}node_modules/babyparse`;
    const mongodbLinkCommand = `${rootPath}/npm/node_modules/mongodb ${assetsPath}node_modules/mongodb`;
    const currentDataFileURI = `${absoluteFilePath.substring(0, absoluteFilePath.indexOf('save-data.js'))}temp1`;
    const histDataFileURI = `${absoluteFilePath.substring(0, absoluteFilePath.indexOf('save-data.js'))}temp2`;
    const mongoUrl = process.env.MONGO_URL;

    if (fs.existsSync(currentDataFileURI)) throw new Meteor.Error('data uploading in process', 'data_calculation_in_process');

    exec(`ln -s -f ${babyparseLinkCommand} && ln -s -f ${mongodbLinkCommand}`, () => {
      fs.writeFile(currentDataFileURI, current, function (err: any) {
        if (err) throw new Meteor.Error(err.message, err.message);

        fs.writeFile(histDataFileURI, hist, function (err: any) {
          console.time();
          const childProcess = fork(`${absoluteFilePath}`, [mongoUrl]);

          childProcess.on('close', () => {
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

              console.log('Updated');
              console.timeEnd();
              DataUpdates.update({}, { status: 'up_data_done', lastDataUpdateDate: new Date() }, { upsert: true });
            }).run();
          });

          childProcess.on('err', (err: any) => {
            Fiber(() => {
              console.log(err);
            }).run();
          });

          childProcess.on('message', (m: any) => {
            const { status } = m;
            Fiber(() => {
              DataUpdates.update({}, { status }, { upsert: true });
            }).run();
          });
        });
      });
    });

    return 'data_calculation_start';
  }
});

export const uploadCoordinates = new ValidatedMethod({
  name: 'data.uploadCoordinates',
  validate: new SimpleSchema({
    fileData: { type: String },
  }).validator(),
  run({ fileData }) {
    if (!this.userId) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    if (!Roles.userIsInRole(this.userId, ['DataUpload', 'Administrator'])) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
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

    return 'coordinates_uploaded';
  }
});

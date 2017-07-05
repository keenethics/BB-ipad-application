import { Meteor } from 'meteor/meteor';
import { exec, fork } from 'child_process';
import * as Fiber from 'fibers';
import * as fs from 'fs';
import * as Baby from 'babyparse';
import * as aes from 'crypto-js/aes';
import * as Guid from 'guid';
import * as utf8 from 'crypto-js/enc-utf8';
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
    oxygenSubmission: { type: String },
    evolutionReport: { type: String },
    'info.period': { type: String },
    'info.lastDataUpdate': { type: String },
    'info.fileNames.oxygenSubmission': { type: String },
    'info.fileNames.evolutionReport': { type: String }
  }).validator(),
  run({ oxygenSubmission, evolutionReport, info, fileNames }) {
    if (!oxygenSubmission || !evolutionReport) {
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
    const objectIdLinkCommand = `${rootPath}/npm/node_modules/objectid ${assetsPath}node_modules/objectid`;
    const currentDataFileURI = `${absoluteFilePath.substring(0, absoluteFilePath.indexOf('save-data.js'))}temp1`;
    const histDataFileURI = `${absoluteFilePath.substring(0, absoluteFilePath.indexOf('save-data.js'))}temp2`;
    const mongoUrl = process.env.MONGO_URL;

    const backupBDS = BusinessDataSources.find({}).fetch().filter(item => delete item._id);
    const backupBD = BusinessData.find({}).fetch().filter(item => delete item._id);
    const updateDateItem = DataUpdates.findOne({});

    const restoreNeeded = { flag: false };

    if (fs.existsSync(currentDataFileURI)) throw new Meteor.Error('data uploading in process', 'data_calculation_in_process');

    exec(`ln -s -f ${babyparseLinkCommand} && ln -s -f ${mongodbLinkCommand} && ln -s -f ${objectIdLinkCommand}`, () => {
      fs.writeFile(currentDataFileURI, oxygenSubmission, function (err: any) {
        if (err) throw new Meteor.Error(err.message, err.message);

        fs.writeFile(histDataFileURI, evolutionReport, function (err: any) {
          console.time();

          const childProcess = fork(`${absoluteFilePath}`, [mongoUrl]);

          setTimeout(() => {
            childProcess.kill();
            restoreNeeded.flag = true;
          }, 1800000);

          childProcess.on('close', () => {
            Fiber(() => {
              if (restoreNeeded.flag) {
                BusinessData.remove({});
                BusinessDataSources.remove({});

                console.log('Restoring data...');
                DataUpdates.update({}, { status: 'up_data_err', lastDataUpdateDate: updateDateItem.lastDataUpdateDate }, { upsert: true });

                backupBDS.forEach((d: any) => {
                  BusinessDataSources.insert(d);
                });

                backupBD.forEach((d: any) => {
                  BusinessData.insert(d);
                });

                DataUpdates.update({}, { status: 'up_data_done', lastDataUpdateDate: updateDateItem.lastDataUpdateDate }, { upsert: true });
              }

              fs.unlinkSync(currentDataFileURI);
              fs.unlinkSync(histDataFileURI);

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

              const { period, fileNames } = info;
              const coordinatesFileName = updateDateItem && updateDateItem.fileNames && updateDateItem.fileNames.geocordinates;

              DataUpdates.update({}, {
                status: 'up_data_done',
                lastDataUpdateDate: new Date(),
                lastDataUpdateText: info.lastDataUpdate,
                period,
                fileNames: { ...fileNames, geocordinates: coordinatesFileName }
              }, { upsert: true });
            }).run();
          });

          childProcess.on('error', (err: any) => {
            if (err) {
              console.log('ERROR IN CALCULATION PROCESS:');
              console.log(err);
              restoreNeeded.flag = true;
            }
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
    fileName: { type: String }
  }).validator(),
  run({ fileData, fileName }) {
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

        const dataUpdateInfo = DataUpdates.findOne({}) || {};
        dataUpdateInfo.fileNames = { ...dataUpdateInfo.fileNames, geocordinates: fileName };
        DataUpdates.update({}, dataUpdateInfo, { upsert: true });
      }
    });

    return 'coordinates_uploaded';
  }
});

export const editUpdateInfoField = new ValidatedMethod({
  name: 'data.editUpdateInfoField',
  validate: new SimpleSchema({
    fieldName: {
      type: String,
      allowedValues: ['lastDataUpdateText', 'period']
    },
    fieldValue: {
      type: String
    }
  }).validator(),
  run({ fieldName, fieldValue }) {
    if (!Roles.userIsInRole(this.userId, ['DataUpload', 'Administrator'])) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    DataUpdates.update({}, { $set: { [fieldName]: fieldValue } });

    return `${fieldName} changed.`;
  }
});

export const fetchData = new ValidatedMethod({
  name: 'data.fetch',
  validate: new SimpleSchema({}).validator(),
  run() {
    if (!this.userId) {
      throw new Meteor.Error('permission_denied', 'permission_denied');
    }

    const guid = Guid.raw();

    Meteor.users.update(this.userId, {
      $set: { 'profile.token': guid }
    });

    const encryptData = (data: any[], key: string) => data.map((item) => aes.encrypt(JSON.stringify(item), key).toString());

    const bussinessData = BusinessData.find().fetch();
    const unitsTitles = UnitsTitles.find().fetch();
    const dataUpdates = DataUpdates.find().fetch();
    const availableCountries = AvailableCountries.find().fetch();
    const marketCountries = MarketCountries.find({ _id: { $in: ['GCHN', 'NAM', 'LAT', 'INDIA', 'APJ', 'MEA', 'EUROPE'] } }).fetch();

    return [
      { name: (BusinessData as any)._name, data: encryptData(bussinessData, guid) },
      { name: (UnitsTitles as any)._name, data: encryptData(unitsTitles, guid) },
      { name: (DataUpdates as any)._name, data: encryptData(dataUpdates, guid) },
      { name: (AvailableCountries as any)._name, data: encryptData(availableCountries, guid) },
      { name: (MarketCountries as any)._name, data: encryptData(marketCountries, guid) }
    ];
  }
});

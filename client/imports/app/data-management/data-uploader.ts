import { Meteor } from 'meteor/meteor';
import { Injectable } from '@angular/core';
import * as Baby from 'babyparse';
import { toCamelCase } from '../../../../both/helpers/to-camel-case';

@Injectable()
export class DataUploader {
  constructor() {

  }

  uploadData(oxygenSubmission: any, evolutionReport: any, info: any) {
    const params: any = {
      oxygenSubmission: null,
      evolutionReport: null,
      info
    };

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (!params.oxygenSubmission) {
          params.oxygenSubmission = reader.result;
          reader.readAsText(evolutionReport);
        } else {
          params.evolutionReport = reader.result;
          Meteor.call('data.upload', params, (err: Meteor.Error, res: string) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        }
      };
      reader.readAsText(oxygenSubmission);
    });
  }

  uploadCoords(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        Meteor.call('data.uploadCoordinates', {
          fileData: reader.result,
          fileName: file.name
        }, (err: Meteor.Error, res: string) => {
          const end = new Date();
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      };
      reader.readAsText(file);
    });
  }
}

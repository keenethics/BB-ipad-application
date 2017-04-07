import { Meteor } from 'meteor/meteor';
import { Injectable } from '@angular/core';
import * as Baby from 'babyparse';
import { toCamelCase } from '../../../../both/helpers/to-camel-case';

@Injectable()
export class DataUploader {
  constructor() {

  }

  uploadData(files: File[]) {
    const params: any = {
      current: null,
      hist: null
    };

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (!params.current) {
          params.current = reader.result;
          reader.readAsText(files[1]);
        } else {
          params.hist = reader.result;
          Meteor.call('data.upload', params, (err: Meteor.Error, res: string) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        }
      };
      reader.readAsText(files[0]);
    });
  }

  uploadCoords(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        Meteor.call('data.uploadCoordinates', {
          fileData: reader.result
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

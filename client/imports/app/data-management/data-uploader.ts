import { Meteor } from 'meteor/meteor';
import { Injectable } from '@angular/core';
import * as Baby from 'babyparse';
import { toCamelCase } from '../../../../both/helpers/to-camel-case';

@Injectable()
export class DataUploader {
  constructor() {

  }

  uploadFile(file: File, type: string) {
    return new Promise((resolve, reject) => {
      const methodName = type === 'data' ?
        'data.upload' : type === 'cords' ?
          'data.uploadCoordinates' : reject({ reason: 'No method name' });

      const reader = new FileReader();
      reader.onload = () => {
        Meteor.call(methodName as string, {
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

import { Meteor } from 'meteor/meteor';
import { Injectable } from '@angular/core';

@Injectable()
export class DataUploader {
  constructor() {

  }

  uploadFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        Meteor.call('data.upload', {
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

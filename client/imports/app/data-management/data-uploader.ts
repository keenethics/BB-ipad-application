import { Meteor } from 'meteor/meteor';
import { Injectable } from '@angular/core';

@Injectable()
export class DataUploader {
  constructor() {

  }

  uploadFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      const start = new Date();
      console.log(start);

      reader.onload = () => {
        Meteor.call('data.upload', {
          fileData: reader.result
        }, (err: Meteor.Error, res: string) => {
          const end = new Date();
          console.log(end);
          console.log(end - start);
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

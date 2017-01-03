import { Injectable } from '@angular/core';

@Injectable()
export class DataManager {
  uploadData(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        Meteor.call('data.upload', {
          fileData: reader.result
        }, (err: Meteor.Error, res: string) => {
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

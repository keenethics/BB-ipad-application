import { Injectable } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';

@Injectable()
export class ProfileSettings {
  changePassword(oldPassword: string, password: string) {
    return new Promise((resolve, reject) => {
      Accounts.changePassword(oldPassword, password, (err: any) => {
        if (err) reject(err.reason);
        resolve();
      });
    });
  }
}

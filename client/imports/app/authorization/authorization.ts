import { Injectable } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/startWith';

@Injectable()
export class Authorization {
  public user$: Observable<any>;

  private userSubscriber: Subscriber<any>;

  constructor() {
    this.initUserObervables();
  }

  initUserObervables() {
    const user = Meteor.user();

    this.user$ = new Observable((sub: Subscriber<any>) => {
      this.userSubscriber = sub;
    }).startWith(user);

    MeteorObservable.autorun().subscribe(() => {
      const user = Meteor.user();

      if (this.userSubscriber) {
        this.userSubscriber.next(user);
      }
    });
  }

  createUser(userOptions: any) {
    return new Promise((resolve, reject) => {
      const { email, password, roleId } = userOptions;

      Meteor.call('users.create',
        { email, password, roleId },
        (err: Meteor.Error, res: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
    });
  }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      Meteor.loginWithPassword(email, password, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      Meteor.logout((err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  isLoggedIn() {
    return Boolean(Meteor.userId());
  }

  user() {
    return Meteor.user() as any;
  }
}

import { Injectable } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class Authorization {
  public user: Observable<any>;
  public userId: Observable<any>;

  constructor() {
    this.initUser();
  }

  private initUser() {
    let userSubscriber: Subscriber<any>;
    let userIdSubscriber: Subscriber<any>;

    this.user = new Observable((sub: Subscriber<any>) => {
      userSubscriber = sub;
    });

    this.userId = new Observable((sub: Subscriber<any>) => {
      userIdSubscriber = sub;
    });

    MeteorObservable.autorun().subscribe(() => {
      const user = Meteor.user();

      if (userSubscriber) {
        userSubscriber.next(user);
      }

      if (userIdSubscriber) {
        userIdSubscriber.next(Meteor.userId());
      }
    });
  }

  signup(userOptions: any) {
    return new Promise((resolve, reject) => {
      Accounts.createUser(userOptions, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      debugger
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
}
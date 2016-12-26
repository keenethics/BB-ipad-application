import { Injectable } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Authorization {
  public user: Observable<any>;
  public userId: Observable<any>;

  constructor() {
    this.initUser();
  }

  private initUser() {
    let userObserver;
    let userIdObserver;

    this.user = new Observable(observer => {
      userObserver = observer;
    });

    this.userId = new Observable(observer => {
      userIdObserver = observer;
    });

    MeteorObservable.autorun().subscribe(() => {
      const user = Meteor.user();

      if (userObserver) {
        userObserver.next(user);
      }

      if (userIdObserver) {
        userIdObserver.next(Meteor.userId());
      }
    });
  }

  signup(userOptions) {
    return new Promise((resolve, reject) => {
      Accounts.createUser(userOptions, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      debugger
      Meteor.loginWithPassword(email, password, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      Meteor.logout((err) => {
        if(err){
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
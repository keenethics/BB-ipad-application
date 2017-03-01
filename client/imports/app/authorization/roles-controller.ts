import { Injectable } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/startWith';

@Injectable()
export class RolesController {
  constructor() {

  }

  getAllRoles(): Array<any> {
    return Roles.getAllRoles()
      .fetch()
      .map((item) => {
        const { _id, name } = item;
        return {
          id: _id,
          name
        };
      });
  }

  userIsInRole(user: any, roles: any): boolean {
    return Roles.userIsInRole(user, roles);
  }

  getRolesForUser(userId: string): Array<string> {
    return Roles.getRolesForUser(userId);
  }
}

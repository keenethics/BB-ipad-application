import { Injectable, EventEmitter } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Mongo } from 'meteor/mongo';
import { BehaviorSubject } from 'rxjs';
import { ToastsManager } from '../common/toasts-manager';


@Injectable()
export class UsersController {
  public editableUser: Meteor.User = null;
  private _users: BehaviorSubject<Meteor.User> = new BehaviorSubject([]);
  private _usersCount: BehaviorSubject<Meteor.User> = new BehaviorSubject(0);

  constructor(private toasts: ToastsManager) {

  }

  get usersCount$() {
    return this._usersCount.asObservable();
  }

  get users$() {
    return this._users.asObservable();
  }

  getUsers(skip: number, limit: number) {
    return new Promise((resolve) => {
      MeteorObservable.subscribe('users', Meteor.userId(), skip, limit)
        .subscribe(() => {
          const users = Meteor.users.find({}).fetch();
          this._users.next(users);
          this._usersCount.next(users.length);
          resolve();
        });
    });
  }

  deleteUser(userId: string) {
    MeteorObservable.call('users.remove', { userId })
      .subscribe((res) => {
        const users = Meteor.users.find({}).fetch();
        this._users.next(users);
      }, (err) => {
        this.toasts.okToast(err.reason);
      });
  }

  updateUser(userId: string, email: string, password: string, roleId: string) {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('users.update', { userId, email, password, roleId })
        .subscribe(res => {

          resolve(res);
        }, err => {
          this.toasts.okToast(err.reason);
          reject(err);
        });
    });
  }

  setEditedUser(user: any) {
    const role = Roles.getRolesForUser(user._id)[0];
    user.roleId = (Meteor as any).roles.findOne({ name: role })._id;
    this.editableUser = user;
  }
};

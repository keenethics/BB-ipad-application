import { Injectable, EventEmitter } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Mongo } from 'meteor/mongo';
import { BehaviorSubject } from 'rxjs';
import { ToastsManager } from '../common/toasts-manager';


@Injectable()
export class UsersController {
  public limit = 0;
  public editableUser: Meteor.User = null;

  private _users: BehaviorSubject<Meteor.User> = new BehaviorSubject([]);
  private _usersCount: BehaviorSubject<Meteor.User> = new BehaviorSubject(0);
  private lastOptions = { limit: 0, skip: 0 };

  constructor(private toasts: ToastsManager) {
    MeteorObservable
      .subscribe('allUsers', Meteor.userId())
      .subscribe((users: Mongo.Collection<Meteor.User>) => {
        const usersCollection = Meteor.users.find({});
        this._users.next(Meteor.users.find({}, { limit: this.limit }).fetch());
        this._usersCount.next(usersCollection.count());
      });
  }

  get usersCount$() {
    return this._usersCount.asObservable();
  }

  get users$() {
    return this._users.asObservable();
  }

  getUsers(limit: number = 0, skip: number = 0) {
    this.lastOptions = { skip, limit };
    const users = Meteor.users.find({}, this.lastOptions).fetch();
    this._users.next(users);
    this._usersCount.next(Meteor.users.find({}).count());
  }

  deleteUser(userId: string) {
    MeteorObservable.call('users.remove', { userId })
      .subscribe((res) => {
        const {limit, skip} = this.lastOptions;
        this.getUsers(limit, skip);
        this._users.next(Meteor.users.find({}, { limit }).fetch());
      }, (err) => {
        this.toasts.okToast(err.reason);
      });
  }

  updateUser(userId: string, email: string, password: string, roleId: string) {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('users.update', { userId, email, password, roleId })
        .subscribe(res => {
          const {limit, skip} = this.lastOptions;
          this.getUsers(limit, skip);
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

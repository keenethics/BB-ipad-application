import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController, MenuController, PopoverController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { getEmailRegExp } from '../../../../../both/helpers/email-regexp';
import { ToastsManager } from '../../common/toasts-manager';
import { LoadingManager } from '../../common/loading-manager';
import { EqualValidator } from '../../common/validators/equal-validator';

import template from './user-management.page.html';
import styles from './user-management.page.scss';

import { Authorization, RolesController } from '../../authorization';
import { UsersController } from '../../settings/users-controller';

import { HomePage } from '../home/home.page';
import { ProfileSettingsPage } from '../profile-settings/profile-settings.page';
import { SwichersPage } from '../swichers/swichers.page';
import { CreateUserPage } from '../create-user/create-user.page';
import { EditUserPage } from '../edit-user/edit-user.page';
import { SigninPage } from '../signin/signin.page';

@Component({
  selector: 'user-management-page',
  styles: [styles],
  template,
  encapsulation: ViewEncapsulation.None
})
export class UserManagementPage implements OnInit {
  private usersLimit: number = 50;
  private usersSkip: number = 0;
  private selectedUser: any;
  private userToDelete: any;
  private countSubscr: Subscription;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private auth: Authorization,
    private usersCtrl: UsersController,
    private toasts: ToastsManager,
    private loadingManager: LoadingManager,
    private rolesCtrl: RolesController,
    private menuCtrl: MenuController,
    private popoverCtrl: PopoverController
  ) {
  }

  ngOnInit() {
    this.countSubscr = this.usersCtrl.usersCount$.subscribe((count: number) => {
      this.usersSkip = count;
    });
    this.usersCtrl.getUsers(0, this.usersLimit);
  }

  ngOnDestroy() {
    if (this.countSubscr) this.countSubscr.unsubscribe();
  }

  ionViewCanEnter() {
    try {
      return (this.auth.user() as any).roles.includes('Administrator');
    } catch (err) {
      return false;
    }
  }

  addUser() {
    const popover = this.popoverCtrl.create(CreateUserPage, {}, { cssClass: 'create-form' });
    popover.present();
  }

  editUser(user: Meteor.User) {
    this.usersCtrl.setEditedUser(user);
    const popover = this.popoverCtrl.create(EditUserPage, {}, { cssClass: 'edit-form' });
    popover.present();
  }

  deleteUser(userId: string) {
    this.usersCtrl.deleteUser(userId);
  }

  isSelected(id: any) {
    return this.selectedUser ? id === this.selectedUser._id : false;
  }

  isDeleting(id: any) {
    return this.userToDelete ? id === this.userToDelete._id : false;
  }

  doInfinite(infiniteScroll: any) {
    this.usersCtrl.getUsers(this.usersSkip, this.usersLimit)
      .then(() => {
        infiniteScroll.complete();
      });
  }

  select(user: Meteor.User) {
    this.selectedUser = user;
  }
}

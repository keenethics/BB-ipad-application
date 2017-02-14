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
  public pages: any;
  public usersLimit: number = 5;

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
    this.pages = {
      home: HomePage,
      swichers: SwichersPage,
      profileSettings: ProfileSettingsPage,
      userManagement: UserManagementPage,
      signin: SigninPage
    };

    this.usersCtrl.limit = this.usersLimit;
  }

  ngOnInit() {
    this.usersCtrl.getUsers(this.usersLimit, 0);
  }

  ionViewCanEnter() {
    try {
      return this.auth.user().roles.includes('Administrator');
    } catch (err) {
      return false;
    }
  }

  setPage(skip: number) {
    this.usersCtrl.getUsers(this.usersLimit, skip);
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
}

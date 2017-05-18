import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController, MenuController, ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { getEmailRegExp } from '../../../../../both/helpers/email-regexp';
import { getPasswordRegExp } from '../../../../../both/helpers/password-regexp';

import { ToastsManager } from '../../common/toasts-manager';
import { LoadingManager } from '../../common/loading-manager';
import { EqualValidator } from '../../common/validators/equal-validator';

import { UsersController } from '../../settings/users-controller';

import template from './edit-user.page.html';
import styles from './edit-user.page.scss';

import { Authorization, RolesController } from '../../authorization';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'edit-user-page',
  styles: [styles],
  template,
  encapsulation: ViewEncapsulation.None
})
export class EditUserPage implements OnInit {
  public userForm: FormGroup;
  public userCredentials: UserCredentials;
  public roles: any;
  public email: string;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private auth: Authorization,
    private toasts: ToastsManager,
    private loadingManager: LoadingManager,
    private rolesCtrl: RolesController,
    private menuCtrl: MenuController,
    private viewCtrl: ViewController,
    private usersCtrl: UsersController
  ) {
    const user = this.usersCtrl.editableUser;
    if (!user) viewCtrl.dismiss();

    this.email = user.emails[0].address.substr(0);

    this.userCredentials = {
      id: user._id,
      email: user.emails[0].address,
      password: '',
      confPass: '',
      roleId: (user as any).roleId
    };

    this.roles = this.rolesCtrl.getAllRoles();
  }

  ngOnInit() {
    this.buildUserForm();
  }

  ionViewCanEnter() {
    try {
      return (this.auth.user() as any).roles.includes('Administrator');
    } catch (err) {
      return false;
    }
  }

  buildUserForm() {
    this.userForm = this.formBuilder.group({
      email: [
        this.userCredentials.email,
        [
          Validators.required,
          Validators.pattern(getEmailRegExp())
        ]
      ],
      password: [
        this.userCredentials.password,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(getPasswordRegExp()),
          new EqualValidator('confPass', 'true')
        ]
      ],
      confPass: [
        this.userCredentials.confPass,
        [
          Validators.required,
          Validators.pattern(getPasswordRegExp()),
          new EqualValidator('password', 'false')
        ]
      ],
      roleId: [
        this.userCredentials.roleId,
        [
          Validators.required,
          (c: AbstractControl) => {
            const existingRolesIds = this.rolesCtrl.getAllRoles()
              .map((item) => {
                return item.id;
              });
            return existingRolesIds.indexOf(c.value) !== -1 ? null : { isInRole: false };
          }
        ]
      ]
    });
  }

  editUser() {
    const { id, email, password, roleId } = this.userCredentials;
    this.usersCtrl.updateUser(id, email, password, roleId)
      .then(() => {
        this.viewCtrl.dismiss();
      });
  }

  isFormValid(form: FormGroup): boolean {
    return !(form.valid && form.dirty && form.touched);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}

interface UserCredentials {
  id: string;
  email: string;
  password: string;
  confPass: string;
  roleId: string;
}

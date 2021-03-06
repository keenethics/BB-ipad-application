import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { getEmailRegExp } from '../../../../../both/helpers/email-regexp';
import { getPasswordRegExp } from '../../../../../both/helpers/password-regexp';

import { ToastsManager } from '../../common/toasts-manager';
import { LoadingManager } from '../../common/loading-manager';
import { EqualValidator } from '../../common/validators/equal-validator';

import template from './create-user.page.html';
import styles from './create-user.page.scss';

import { Authorization, RolesController } from '../../authorization';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'create-user-page',
  styles: [styles],
  template,
})
export class CreateUserPage implements OnInit {
  public newUserForm: FormGroup;
  public newUserCredentials: NewUserCredentials;
  public roles: any;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private auth: Authorization,
    private toasts: ToastsManager,
    private loadingManager: LoadingManager,
    private rolesCtrl: RolesController,
    private menuCtrl: MenuController,
    private viewCtrl: ViewController
  ) {
    this.newUserCredentials = {
      email: '',
      password: '',
      confPass: '',
      roleId: ''
    };

    this.roles = this.rolesCtrl.getAllRoles();
  }

  ngOnInit() {
    this.buildNewUserForm();
  }

  ionViewCanEnter() {
    try {
      return (this.auth.user() as any).roles.includes('Administrator');
    } catch (err) {
      return false;
    }
  }

  buildNewUserForm() {
    this.newUserForm = this.formBuilder.group({
      email: [
        this.newUserCredentials.email,
        [
          Validators.required,
          Validators.pattern(getEmailRegExp())
        ]
      ],
      password: [
        this.newUserCredentials.password,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(getPasswordRegExp()),
          new EqualValidator('confPass', 'true')
        ]
      ],
      confPass: [
        this.newUserCredentials.confPass,
        [
          Validators.required,
          Validators.pattern(getPasswordRegExp()),
          new EqualValidator('password', 'false')
        ]
      ],
      roleId: [
        this.newUserCredentials.roleId,
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

  isFormValid(form: FormGroup): boolean {
    return !(form.valid && form.dirty && form.touched);
  }

  createUser() {
    this.loadingManager.loading('registration');
    this.auth.createUser(this.newUserCredentials)
      .then((res: any) => {
        this.loadingManager.loadingInst.dismiss();
        this.toasts.okToast(res);
        this.newUserForm.reset();
      })
      .catch((err) => {
        this.loadingManager.loadingInst.dismiss();
        this.toasts.okToast(err.reason);
      });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  isError(controlName: string, errorName: string) {
    const control = this.newUserForm.controls[controlName];
    return control.errors && control.errors[errorName] && control.touched && control.invalid;
  }
}

interface NewUserCredentials {
  email: string;
  password: string;
  confPass: string;
  roleId: string;
}

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastsManager } from '../../common/toasts-manager';
import { LoadingManager } from '../../common/loading-manager';
import { EqualValidator } from '../../common/validators/equal-validator';
import { ProfileSettings } from '../../settings';

import template from './profile-settings.page.html';
import styles from './profile-settings.page.scss';

import { SwichersPage } from '../swichers/swichers.page';
import { HomePage } from '../home/home.page';
import { UserManagementPage } from '../user-management/user-management.page';
import { SigninPage } from '../signin/signin.page';

@Component({
  selector: 'profile-settings-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class ProfileSettingsPage implements OnInit {
  public passwordsForm: FormGroup;
  public passwords: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private loadingManager: LoadingManager,
    private toastManager: ToastsManager,
    private profileSettings: ProfileSettings) {
  }

  ngOnInit() {
    this.buildPassworsForm();
  }

  buildPassworsForm() {
    this.passwordsForm = this.formBuilder.group({
      oldPassword: [
        this.passwords.oldPassword,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.minLength(6)
        ]
      ],
      password: [
        this.passwords.password,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.minLength(6),
          new EqualValidator('confPass', 'true')
        ]
      ],
      confPass: [
        this.passwords.confPass,
        [
          Validators.required,
          new EqualValidator('password', 'false')
        ]
      ]
    });
  }

  isFormValid(form: FormGroup): boolean {
    return !(form.valid && form.dirty && form.touched);
  }

  changePassword() {
    const { oldPassword, password } = this.passwords;

    this.loadingManager.loading('changing_password');
    this.profileSettings.changePassword(oldPassword, password)
      .then(() => {
        this.passwordsForm.reset();
        this.loadingManager.loadingInst.dismiss();
        this.toastManager.okToast('password_changed');
      })
      .catch((err) => {
        this.loadingManager.loadingInst.dismiss();
        this.toastManager.okToast(err);
      });
  }
}

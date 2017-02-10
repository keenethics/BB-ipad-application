import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastsManager } from '../../common/toasts-manager';
import { LoadingManager } from '../../common/loading-manager';
import { EqualValidator } from '../../common/validators/equal-validator';
import { ProfileSettings } from '../../settings';

import template from './profile-settings.page.html';
import styles from './profile-settings.page.scss';

@Component({
  selector: 'profile-settings',
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

    this.loadingManager.loading('Changing password...');
    this.profileSettings.changePassword(oldPassword, password)
      .then(() => {
        this.loadingManager.loadingInst.dismiss();
        this.toastManager.okToast('Password cahnged successfully');
      })
      .catch((err) => {
        this.loadingManager.loadingInst.dismiss();
        this.toastManager.okToast(err);
      });
  }
}
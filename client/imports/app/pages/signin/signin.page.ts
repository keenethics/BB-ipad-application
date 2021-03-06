import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { getEmailRegExp } from '../../../../../both/helpers/email-regexp';
import { getPasswordRegExp } from '../../../../../both/helpers/password-regexp';

import {
  ToastsManager,
  WindowSize,
  LoadingManager
} from '../../common';

import template from './signin.page.html';
import styles from './signin.page.scss';

import { Authorization } from '../../authorization/authorization';

import { HomePage } from '../home/home.page';

@Component({
  selector: 'signin-page',
  styles: [styles],
  template,
  encapsulation: ViewEncapsulation.None
})
export class SigninPage implements OnInit {
  public loginForm: FormGroup;
  public loginCredentials: LoginCredentials;
  public user: any;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private auth: Authorization,
    private toasts: ToastsManager,
    private loadingManager: LoadingManager,
    private windowSize: WindowSize,
    private menuCtrl: MenuController
  ) {
    this.loginCredentials = {
      email: '',
      password: ''
    };
  }

  ngOnInit() {
    this.buildLoginForm();
  }

  ionViewCanEnter() {
    return !this.auth.isLoggedIn();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'filter-menu');
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        this.loginCredentials.email,
        [
          Validators.required,
          Validators.pattern(getEmailRegExp())
        ]
      ],
      password: [
        this.loginCredentials.password,
        [
          Validators.required,
          Validators.pattern(getPasswordRegExp())
        ]
      ]
    });
  }

  isFormValid(form: FormGroup): boolean {
    return !(form.valid && form.dirty && form.touched);
  }

  isError(controlName: string, errorName: string) {
    const control = this.loginForm.controls[controlName];
    return control.errors && control.errors[errorName] && control.touched && control.invalid;
  }

  login() {
    const { email, password } = this.loginCredentials;

    this.loadingManager.loading('login');
    this.auth.login(email, password)
      .then(() => {
        this.navCtrl.setRoot(HomePage);
      })
      .catch((err) => {
        this.loadingManager.loadingInst.dismiss();
        this.toasts.okToast(err.reason);
      });
  }
}

interface LoginCredentials {
  email: string;
  password: string;
}

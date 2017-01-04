import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { getEmailRegExp } from '../../common/helpers/email-regexp';
import { ToastsManager } from '../../common/toasts-manager';
import { LoadingManager } from '../../common/loading-manager';

import template from './signin.page.html';
import styles from './signin.page.scss';

import { Authorization } from '../../authorization/authorization';

import { HomePage } from '../home/home.page';

@Component({
  selector: 'signin-page',
  styles: [styles],
  template,
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
    private loadingManager: LoadingManager
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
          Validators.maxLength(40),
          Validators.minLength(6)
        ]
      ]
    });

    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    // TODO: Generate array of errors messages here
  }

  isFormValid(form: FormGroup): boolean {
    return !(form.valid && form.dirty && form.touched);
  }

  login() {
    const { email, password } = this.loginCredentials;

    this.loadingManager.loading('Joining...');
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

import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { getEmailRegExp } from '../../common/helpers/email-regexp';
import { ToastsManager } from '../../common/toasts-manager';
import { LoadingManager } from '../../common/loading-manager';
import { EqualValidator } from '../../common/validators/equal-validator';

import template from './signup.page.html';
import styles from './signup.page.scss';

import { Authorization } from '../../authorization/authorization';

@Component({
  selector: 'signup-page',
  styles: [styles],
  template,
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;
  public signupCredentials: SignupCredentials;
  public user: any;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private auth: Authorization,
    private toasts: ToastsManager,
    private loadingManager: LoadingManager
  ) {
    this.signupCredentials = {
      email: '',
      password: '',
      confPass: ''
    };
  }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.signupForm = this.formBuilder.group({
      email: [
        this.signupCredentials.email,
        [
          Validators.required,
          Validators.pattern(getEmailRegExp())
        ]
      ],
      password: [
        this.signupCredentials.password,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.minLength(6),
          new EqualValidator('confPass', 'true')
        ]
      ],
      confPass: [
        this.signupCredentials.confPass,
        [
          Validators.required,
          new EqualValidator('password', 'false')
        ]
      ]
    });

    this.signupForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    // TODO: Generate array of errors messages here
  }

  isFormValid(form: FormGroup): boolean {
    return !(form.valid && form.dirty && form.touched);
  }

  singup() {
    const { email, password } = this.signupCredentials;

    this.loadingManager.loading('Registration...');
    this.auth.signup(this.signupCredentials)
      .catch((err) => {
        this.loadingManager.loadingInst.dismiss();
        this.toasts.okToast(err.reason);
      });
  }
}

interface SignupCredentials {
  email: string;
  password: string;
  confPass: string;
}

import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import template from './login.page.html';
import styles from './login.page.scss';

import { Authorization } from '../../app/accounts/authorization';

@Component({
  selector: 'login-page',
  styles: [styles],
  template,
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public loginCredentials: LoginCredentials;
  public user;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private auth: Authorization,
    private toastCtrl: ToastController
  ) {
    this.loginCredentials = {
      email: '',
      password: ''
    };
  }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = this.formBuilder.group({
      email: [
        this.loginCredentials.email,
        [
          Validators.pattern(emailRegex)
        ]
      ],
      password: [
        this.loginCredentials.password,
        [
          Validators.maxLength(40),
          Validators.minLength(6)
        ]
      ]
    });

    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    // TODO: Generate array of errors messages
  }

  isFormValid(form: FormGroup): boolean {
    return !(form.valid && form.dirty && form.touched);
  }

  login() {
    const { email, password } = this.loginCredentials;

    this.auth.login(email, password)
      .then(() => {

      }, (err) => {
        this.getToast(err.reason).present();
      });
  }

  private getToast(message) {
    return this.toastCtrl.create({
      message,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
  }
}

interface LoginCredentials {
  email: String;
  password: String;
}

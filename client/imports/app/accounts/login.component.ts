import { Component, NgZone } from '@angular/core'; 
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { Route } from '@angular/router';
import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

import template from './login.component.html';
import style from './login.component.css';

declare var Package;
declare var _;

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'login-buttons',
  template,
  style: [style]
})

@Injectable()
export class LoginComponent {
  autorunComputation: Tracker.Computation;
  currentUser: Meteor.User;
  currentUserId: string;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  services: Array<any>;
  credentials: LoginCredentials;
  errors: Array<string>;
  isPasswordRecovery: boolean;
  isSignup: boolean;
  isDropdownOpen: boolean;
  message: string;

  constructor(private zone: NgZone, private router: Router ) {
    this._initAutorun();
    this.services = this._getLoginServices();
    this.resetErrors();
    this.isPasswordRecovery = false;
    this.isSignup = false;
    this.isDropdownOpen = false;
    this._resetCredentialsFields();
  }

  _resetCredentialsFields() {
    this.credentials = { email: '', password: '' };
  }

  resetErrors() {
    this.errors = [];
    this.message = "";
  }

  singleService(): Object {
    let services = this._getLoginServices();

    return services[0];
  }

  displayName(): string {
    let user : any = this.currentUser;

    if (!user)
      return '';

    if (user.profile && user.profile.name)
      return user.profile.name;

    if (user.username)
      return user.username;

    if (user.emails && user.emails[0] && user.emails[0].address)
      return user.emails[0].address;

    return '';
  };

  login(): void {
    this.resetErrors();

    let email: string = this.credentials.email;
    let password: string = this.credentials.password;

    Meteor.loginWithPassword(email, password, (error) => {
      if (error) {
        this.errors.push(error.reason || "Unknown error");
      }
      else {
        this.isDropdownOpen = false;
        this._resetCredentialsFields();
        this.router.navigate(['d3map']);
        return false;
      }
    });
  }

  recover() {
    this.resetErrors();

    Accounts.forgotPassword({ email: this.credentials.email }, (error) => {
      if (error) {
        this.errors.push(error.reason || "Unknown error");
      }
      else {
        this.message = "You will receive further instruction to you email address!";
        this.isDropdownOpen = false;
        this._resetCredentialsFields();
      }
    });
  }

  logout(): void {
    Meteor.logout(function(){
      this.isDropdownOpen = false;
      this.router.navigate(['']);
      return false;
    });

  }

  signup(): void {
    this.resetErrors();

    Accounts.createUser(this.credentials, (error) => {
      if (error) {
        this.errors.push(error.reason || "Unknown error");
      }
      else {
        this.isDropdownOpen = false;
        this._resetCredentialsFields();
      }
    });
  }

  _hasPasswordService(): boolean {
    return !!Package['accounts-password'];
  }

  _getLoginServices(): Array<any> {
    let services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];
    services.sort();

    if (this._hasPasswordService())
      services.push('password');

    return _.map(services, function(name) {
      return { name: name };
    });
  }

  dropdown(): boolean {
    return this._hasPasswordService() || this._getLoginServices().length > 1;
  }

  _initAutorun(): void {
    this.autorunComputation = Tracker.autorun(() => {
      this.zone.run(() => {
        this.currentUser = Meteor.user();
        this.currentUserId = Meteor.userId();
        this.isLoggingIn = Meteor.loggingIn();
        this.isLoggedIn = !!Meteor.user();
      })
    });
  }
}

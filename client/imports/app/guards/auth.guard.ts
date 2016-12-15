import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardHome implements CanActivate {
  constructor(private router: Router) { 
  	console.log('auth guard constructor')
  }
  canActivate() {
    return true;
  }
}

@Injectable()
export class AuthGuardD3 implements CanActivate {
  constructor(private router: Router) {
  }
  canActivate() {
    if(Meteor.userId()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}

export const AUTHGUARD_PROVIDERS = [
  AuthGuardHome,AuthGuardD3
];
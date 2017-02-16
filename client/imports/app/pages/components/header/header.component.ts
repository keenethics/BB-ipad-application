import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { NavController } from 'ionic-angular';

import template from './header.component.html';

import { Authorization } from '../../../authorization';

import { SigninPage } from '../../index';

@Component({
  selector: 'header',
  template
})
export class HeaderComponent {
  @Input('isButtonEnabled') isButtonEnabled: boolean;
  @Output('onButtonClick') onButtonClick = new EventEmitter();

  constructor(private auth: Authorization, private navCtrl: NavController) {
  }

  emitButtonClick(menuTitle: string) {
    this.onButtonClick.emit(menuTitle);
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout().then(() => {
      this.navCtrl.setRoot(SigninPage);
    });
  }
}

import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { NavController } from 'ionic-angular';

import template from './header.component.html';
import styles from './header.component.scss';

import { Authorization, RolesController } from '../../../authorization';
import { DataUploader } from '../../../data-management';
import { LoadingManager, ToastsManager } from '../../../common';

import { SigninPage, HomePage, PreferencesPage } from '../../index';

import { FilterController } from '../../../filters';

@Component({
  selector: 'header',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Input('isButtonEnabled') isButtonEnabled: boolean;
  @Output('onButtonClick') onButtonClick = new EventEmitter();

  constructor(
    private auth: Authorization,
    private navCtrl: NavController,
    private rolesCtrl: RolesController,
    private dataUploader: DataUploader,
    private loadingCtrl: LoadingManager,
    private toastCtrl: ToastsManager,
    private filterCtrl: FilterController
  ) {
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

  canUserUploadData() {
    const userId = this.auth.user() && this.auth.user()._id;
    const roles = ['Administrator', 'DataUpload'];
    return this.rolesCtrl.userIsInRole(userId, roles);
  }

  isAdmin() {
    const userId = this.auth.user() && this.auth.user()._id;
    const roles = ['Administrator'];
    return this.rolesCtrl.userIsInRole(userId, roles);
  }

  openPage(name: string) {
    switch (name) {
      case 'home': {
        if (this.navCtrl.getActive().component === HomePage) {
          // this.filterCtrl.resetFilter(); break;
          break;
        } else {
          this.navCtrl.setRoot(HomePage); break;
        }
      }
      case 'preferences': this.navCtrl.setRoot(PreferencesPage); break;
    }
  }
}

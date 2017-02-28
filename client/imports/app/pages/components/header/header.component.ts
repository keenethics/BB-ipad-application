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

import { SigninPage } from '../../index';
import { HomePage } from '../../home/home.page';
import { SwichersPage } from '../../swichers/swichers.page';
import { UserManagementPage } from '../../user-management/user-management.page';

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

  uploadData(file: File) {
    this.loadingCtrl.loading('Uploading data...');
    this.dataUploader.uploadFile(file)
      .then((res: string) => {
        this.loadingCtrl.loadingInst.dismiss();
        this.toastCtrl.okToast(res);
      })
      .catch((err) => {
        this.toastCtrl.okToast(err.reason || err.message || err);
      });
  }

  openPage(name: string) {
    switch (name) {
      case 'home': {
        console.log(this.navCtrl.getActive());
        if (this.navCtrl.getActive().component === HomePage) {
          // this.filterCtrl.resetFilter(); break;
          break;
        } else {
          this.navCtrl.setRoot(HomePage); break;
        }
      }
      case 'switchers': this.navCtrl.setRoot(SwichersPage); break;
      case 'user-management': this.navCtrl.setRoot(UserManagementPage); break;
    }
  }
}

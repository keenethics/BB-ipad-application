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
    private toastCtrl: ToastsManager
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
}

import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { MenuController, Platform } from 'ionic-angular';
import { RolesController } from '../../authorization';

import { ToastsManager, LoadingManager } from '../../common';
import { DataUploader } from '../../data-management';
import styles from './upload-data.page.scss';
import template from './upload-data.page.html';

@Component({
  selector: 'upload-data-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class UploadDataPage {
  constructor(
    private dataUploader: DataUploader,
    private loadingCtrl: LoadingManager,
    private toastCtrl: ToastsManager,
    private platform: Platform,
    private formBuilder: FormBuilder,
    private roles: RolesController
  ) { }

  canUpload() {
    return (this.roles.userIsInRole(Meteor.userId(), ['Administrator', 'DataUpload']) && this.platform.is('core'));
  }

  uploadData(file: File, type: string) {
    this.loadingCtrl.loading('uploading_data');
    this.dataUploader.uploadFile(file, type)
      .then((res: string) => {
        this.loadingCtrl.loadingInst.dismiss();
        this.toastCtrl.okToast(res);
      })
      .catch((err) => {
        this.toastCtrl.okToast(err.reason || err.message || err);
      });
  }

  isCsvFile(target: any) {
    const file = target.files[0];
    const fileNameArr = (file.name as string).split('.');
    const fileType = fileNameArr[fileNameArr.length - 1].toLowerCase();

    if (!file) return false;
    if (fileType !== 'csv') return false;

    return true;
  }

  wrongFileType() {
    this.toastCtrl.okToast('wrong_file_type');
  }
};

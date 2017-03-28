import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { MenuController, Platform } from 'ionic-angular';
import { RolesController } from '../../authorization';

import { ToastsManager, LoadingManager } from '../../common';
import { DataUploader } from '../../data-management';
import { PickFileComponent } from '../../common/components/pick-file/pick-file.component';

import styles from './upload-data.page.scss';
import template from './upload-data.page.html';

@Component({
  selector: 'upload-data-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class UploadDataPage {
  private _dataFiles: File[] = [];

  constructor(
    private dataUploader: DataUploader,
    private loadingCtrl: LoadingManager,
    private toastCtrl: ToastsManager,
    private formBuilder: FormBuilder,
    private roles: RolesController
  ) { }

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

  uploadData() {
    this.loadingCtrl.loading('uploading_data');
    this.dataUploader.uploadData(this._dataFiles)
      .then((res: string) => {
        this.loadingCtrl.loadingInst.dismiss();
        this.toastCtrl.okToast(res);
        this._dataFiles = [];
      })
      .catch((err: any) => {
        this.toastCtrl.okToast(err.reason || err.message || err);
        this._dataFiles = [];
      });
  }

  pickDataBehaviour(file: File) {
    if (!this._dataFiles.length) {
      this._dataFiles.push(file);
    } else if (this._dataFiles.length === 1) {
      this._dataFiles.push(file);
      this.uploadData();
    }
  }

  uploadCoords(file: File) {
    this.loadingCtrl.loading('uploading_data');
    this.dataUploader.uploadCoords(file)
      .then((res: string) => {
        this.loadingCtrl.loadingInst.dismiss();
        this.toastCtrl.okToast(res);
      })
      .catch((err: any) => {
        this.toastCtrl.okToast(err.reason || err.message || err);
      });
  }
};

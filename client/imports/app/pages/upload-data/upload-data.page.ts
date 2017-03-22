import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { MenuController } from 'ionic-angular';

import { ToastsManager, LoadingManager } from '../../common';
import { DataUploader } from '../../data-management';
import styles from './upload-data.page.scss';
import template from './upload-data.page.html';

@Component({
  selector: 'upload-data-page',
  template,
  styles: [styles]
})
export class UploadDataPage {
  public file: File;
  public fileData: String;
  public uploadFileForm: FormGroup;

  constructor(
    private toastCtrl: ToastsManager,
    private loadingCtrl: LoadingManager,
    private formBuilder: FormBuilder,
    private dataUploader: DataUploader,
    private menuCtrl: MenuController
  ) {
    this.buildUploadFileForm();
  }

  buildUploadFileForm() {
    this.uploadFileForm = this.formBuilder.group({
      file: [
        this.file,
        [
          Validators.required
        ]
      ]
    });
  }

  onChange(event: Event) {
    const file = (event.srcElement as HTMLInputElement).files[0];
    if (file.type === 'text/csv') {
      this.file = file;
    } else {
      this.uploadFileForm.reset();
      this.toastCtrl.okToast('select_csv');
    }
  }

  isFileSelected() {
    return Boolean(this.file);
  }

  uploadFile() {
    this.loadingCtrl.loading('upload_data');
    this.dataUploader.uploadFile(this.file, 'data')
      .then((res: string) => {
        this.uploadFileForm.reset();
        this.file = null;
        this.loadingCtrl.loadingInst.dismiss();
        this.toastCtrl.okToast(res);
      })
      .catch((err) => {
        this.toastCtrl.okToast(err.reason || err.message || err);
      });
  }

  menuToggle() {
    this.menuCtrl.toggle();
  }
};

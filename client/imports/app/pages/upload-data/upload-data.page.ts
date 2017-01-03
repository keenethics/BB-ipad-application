import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ToastsManager } from '../../common/toasts-manager';
import { DataManager } from '../../data-management/data-manager';
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
    private formBuilder: FormBuilder,
    private dataManager: DataManager
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
      this.toastCtrl.okToast('Please select csv file');
    }
  }

  isFileSelected() {
    return Boolean(this.file);
  }

  uploadFile() {
    this.dataManager.uploadData(this.file)
      .then((res: string) => {
        this.uploadFileForm.reset();
        this.file = null;
        this.toastCtrl.okToast(res);
      })
      .catch((err) => {
        this.toastCtrl.okToast(err.reason || err.message || err);
      });
  }
};

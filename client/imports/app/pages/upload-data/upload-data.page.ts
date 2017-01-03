import { Component } from '@angular/core';
import { File } from 'ionic-native';
import 'babyparse/babyparse.js';

import { ToastsManager } from '../../common/toasts-manager';

import styles from './upload-data.page.scss';
import template from './upload-data.page.html';

declare const FilePicker: any;
declare const Baby: any;

@Component({
  selector: 'upload-data-page',
  template,
  styles: [styles]
})
export class UploadDataPage {
  constructor(private toastCtrl: ToastsManager) {

  }

  uploadData() {
    FilePicker.pickFile(
      (path: string) => {
        const fileName = path.substr(path.lastIndexOf('/') + 1);
        const filePath = path.substring(0, path.lastIndexOf('/') + 1);

        File.checkFile(path, fileName)
          .then(() => {
            this.toastCtrl.okToast('ok');
            console.log('ok');
          })
          .catch((err) => {
            this.toastCtrl.okToast(err);
            console.log(err);
          });

        // File.readAsText(filePath, fileName)
        //   .then((data: string) => {
        //     console.log(data);
        //     this.toastCtrl.okToast(data);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     this.toastCtrl.okToast(err.message);
        //   });
        // this.file.readAsText();
      },
      (err: any) => {
        this.toastCtrl.okToast(err);
      }
    );
  }

  isFilePickerEnabled() {
    return !!FilePicker;
  }
};

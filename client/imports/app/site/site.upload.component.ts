import { Component } from '@angular/core';
import template from './site.upload.component.html';
import style from './site.upload.component.scss';
import { upload } from '../../../../both/methods/site-upload.methods';
@Component({
  selector: 'site-upload',
  template,
  styles: [ style ]
})

export class SiteUploadComponent {
  fileIsOver: boolean = false;
  uploading: boolean = false;
  fileMessage = 'Drop site json here'

  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: File): void {
    this.uploading = true;
    this.fileMessage = 'File being uploaded'

    upload(file)
    .then((result) => {
      this.uploading = false;
      this.fileMessage = 'File Upload Complete.'
    })
    .catch((error) => {
      this.uploading = false;
      this.fileMessage = 'Error in file upload'
      console.log(`Something went wrong!`, error);
    });
  }
}
import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';
import { TextProvider } from '../notifications';

@Injectable()
export class ToastsManager {
  private okToastInst: Toast;

  constructor(public toastCtrl: ToastController, private _textProvider: TextProvider) { }

  okToast(message: string): Promise<any> {
    if (this.okToastInst) {
      this.okToastInst.dismiss();
    }

    this.okToastInst = this.toastCtrl.create({
      message: this._textProvider.text(message),
      showCloseButton: true,
      closeButtonText: 'OK',
      duration: 30000,
    });

    this.okToastInst.present();

    return new Promise((resolve) => {
      this.okToastInst.onDidDismiss(() => {
        resolve();
      });
    });
  }
}

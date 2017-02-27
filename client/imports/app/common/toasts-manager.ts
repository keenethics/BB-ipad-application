import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';

@Injectable()
export class ToastsManager {
  private okToastInst: Toast;

  constructor(public toastCtrl: ToastController) { }

  okToast(message: string): Promise<any> {
    if (this.okToastInst) {
      this.okToastInst.dismiss();
    }

    this.okToastInst = this.toastCtrl.create({
      message,
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

import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingManager {
  public loadingInst: Loading;

  constructor(private loadingCtrl: LoadingController) { }

  loading(message: string): Promise<any> {
    if (this.loadingInst) {
      this.loadingInst.dismiss();
    }

    this.loadingInst = this.loadingCtrl.create({
      content: message,
      dismissOnPageChange: true
    });

    this.loadingInst.present();

    return new Promise((resolve) => {
      this.loadingInst.onDidDismiss(() => {
        resolve();
      });
    });
  }
}
import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';
import { TextProvider } from '../notifications';

@Injectable()
export class LoadingManager {
  public loadingInst: Loading;

  constructor(private loadingCtrl: LoadingController, private _textProvider: TextProvider) { }

  loading(message: string): Promise<any> {
    if (this.loadingInst) {
      this.loadingInst.dismiss();
    }

    this.loadingInst = this.loadingCtrl.create({
      content: this._textProvider.text(message),
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

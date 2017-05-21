import { Component, ViewEncapsulation, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MeteorObservable } from 'meteor-rxjs';
import { DataUpdates } from '../../../../../both/data-management';

import { MenuController, Platform } from 'ionic-angular';
import { RolesController } from '../../authorization';

import { ToastsManager, LoadingManager } from '../../common';
import { DataUploader, DataUpdateInfo, DataProvider } from '../../data-management';
import { LocalCollectionsManager } from '../../offline/local-collections-manager';
import { PickFileComponent } from '../../common/components/pick-file/pick-file.component';

import styles from './upload-data.page.scss';
import template from './upload-data.page.html';

@Component({
  selector: 'upload-data-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class UploadDataPage implements OnDestroy, OnInit {
  private _dataFiles: Map<string, File> = new Map();
  private _status: string;
  private _updateDate: Date;
  private _subscr: any;
  private _dataForm: FormGroup;
  private _period: string;

  infoData = {
    period: '',
    lastDataUpdate: ''
  };

  constructor(
    private dataUploader: DataUploader,
    private loadingCtrl: LoadingManager,
    private toastCtrl: ToastsManager,
    private formBuilder: FormBuilder,
    private roles: RolesController,
    private dateInfo: DataUpdateInfo,
    private lcManager: LocalCollectionsManager,
    private dataProvider: DataProvider
  ) { }

  ngOnInit() {
    this.buildDataForm();

    this._subscr = this.dateInfo.info$.subscribe(info => {
      if (info) {
        const { status, lastDataUpdateDate } = info;
        this._status = status === 'up_data_done' ? '' : status;
        if (lastDataUpdateDate) {
          this._updateDate = lastDataUpdateDate;
        }
      }
    });
  }

  ngOnDestroy() {
    this._subscr.unsubscribe();
  }

  buildDataForm() {
    this._dataForm = this.formBuilder.group({
      period: [
        this.infoData.period,
        [
          Validators.required
        ]
      ],
      lastDataUpdate: [
        this.infoData.lastDataUpdate,
        [
          Validators.required
        ]
      ]
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

  isFormValid() {
    return (this._dataForm.valid) && (this._dataFiles.size === 2);
  }

  wrongFileType() {
    this.toastCtrl.okToast('wrong_file_type');
  }

  uploadData() {
    const current = this._dataFiles.get('oxygen');
    const hist = this._dataFiles.get('evolution');

    this.dataUploader.uploadData(
      current,
      hist,
      { ...this._dataForm.getRawValue(), fileNames: { current: current.name, hist: hist.name } })
      .then((res: string) => {
        this.toastCtrl.okToast(res);
        this._dataFiles = new Map();
        this._dataForm.reset();
      })
      .catch((err: any) => {
        this.toastCtrl.okToast(err.reason || err.message || err);
      });
  }

  pickDataBehaviour(file: File, key: string) {
    this._dataFiles.set(key, file);
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

  syncLocalStorrage() {
    this.loadingCtrl.loading('Sync data...');
    this.lcManager.fetchToStorrage(this.dataProvider)
      .then(() => {
        this.loadingCtrl.loadingInst.dismiss();
        this.toastCtrl.okToast('Data saved to local storrage.');
      });
  }
};

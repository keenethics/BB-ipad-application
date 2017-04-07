import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import { Platform } from 'ionic-angular';

import { FormArray, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { RolesController } from '../../authorization';
import { DataUploader } from '../../data-management';
import { LoadingManager, ToastsManager } from '../../common';

import template from './switchers.component.html';
import styles from './switchers.component.scss';

@Component({
  selector: 'map-switchers',
  styles: [styles],
  encapsulation: ViewEncapsulation.None,
  template
})
export class MapSwitchers implements OnInit, OnChanges {
  public switchersForm: FormGroup;
  @Input('switchers') switchers: any;
  @Input('switchersState') switchersState: any;
  @Output('onChanges') onChanges = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private roles: RolesController
  ) { }

  ngOnInit() {
    if (!this.switchers) {
      this.switchers = [
        { labels: ['HC size as circle', 'HC size as bar pins'], value: false, key: 'charts' },
        { labels: ['Linear HC scaling', 'Log HC scaling'], value: false, key: 'scaling' },
        { labels: ['Show region name', 'Hide region name'], value: false, key: 'labels' },
        { labels: ['Show HC value', 'Hide HC value'], value: false, key: 'values' }
      ];
    }

    this.switchersForm = this.formBuilder.group(this.switchers
      .reduce((acc: Object, s: any) => Object.assign(acc, { [s.key]: s.value }), {}));
  }

  ngOnChanges(changes: any) {
    if (changes.switchersState.currentValue) {
      const switchersState = changes.switchersState.currentValue;
      Object.keys(switchersState).forEach((key) => {
        this.switchersForm.controls[key].setValue(switchersState[key]);
      });
    }
  }

  emitChanges(swicher: any) {
    swicher.value = !swicher.value;
    this.onChanges.emit(this.switchersForm.getRawValue());
  }

  setValue(control: FormControl, value: boolean) {
    control.setValue(value);
    this.onChanges.emit(this.switchersForm.getRawValue());
  }
}

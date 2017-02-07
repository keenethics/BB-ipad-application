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

import { FormArray, FormControl, FormBuilder, FormGroup } from '@angular/forms';

import template from './swichers.component.html';
import styles from './swichers.component.scss';

@Component({
  selector: 'map-swichers',
  styles: [styles],
  encapsulation: ViewEncapsulation.None,
  template
})
export class MapSwichers implements OnInit, OnChanges {

  public swichersForm: FormGroup;
  @Input('swichers') swichers: any;
  @Input('swichersState') swichersState: any;
  @Output('onChanges') onChanges = new EventEmitter();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (!this.swichers) {
      this.swichers = [
        { labels: ['Circle Pins', 'Bar Pins'], value: false, key: 'charts' },
        { labels: ['Linear Scaling', 'Logarithm Scaling'], value: false, key: 'scaling' },
        { labels: ['Show Info Labels', 'Hide Info Labels'], value: false, key: 'labels' },
        { labels: ['Show Values', 'Hide Values'], value: false, key: 'values' }
      ];
    }

    this.swichersForm = this.formBuilder.group(this.swichers
      .reduce((acc: Object, s: any) => Object.assign(acc, { [s.key]: s.value }), {}));
  }

  ngOnChanges(changes: any) {
    if (changes.swichersState.currentValue) {
      const swichersState = changes.swichersState.currentValue;
      Object.keys(swichersState).forEach((key) => {
        this.swichersForm.controls[key].setValue(swichersState[key]);
      });
    }
  }

  emitChanges() {
    this.onChanges.emit(this.swichersForm.getRawValue());
  }
}
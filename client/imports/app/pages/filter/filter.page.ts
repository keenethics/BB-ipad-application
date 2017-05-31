import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { DataProvider } from '../../data-management';
import { MeteorObservable } from 'meteor-rxjs';

import styles from './filter.page.scss';
import template from './filter.page.html';

@Component({
  selector: 'filter-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None,
  providers: [DataProvider]
})
export class FilterPage {
  constructor(
    private fb: FormBuilder,
    private dataProvider: DataProvider
  ) {
  }
};

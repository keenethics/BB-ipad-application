import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FilterController } from '../../filters';
import styles from './filter.page.scss';
import template from './filter.page.html';

@Component({
  selector: 'filter-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class FilterPage implements OnInit {
  public filterForm: FormGroup;
  public range: string;

  constructor(
    private filterCtrl: FilterController,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.buildFilterForm();
  }

  log() {
    console.log(this.filterForm);
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      valueRange: this.fb.control({
        value: {
          lower: 0,
          upper: 100
        }
      })
    });
  }
};

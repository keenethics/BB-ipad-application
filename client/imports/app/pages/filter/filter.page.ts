import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { DataProvider } from '../../data-management';
import { FilterController } from '../../filters';
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
export class FilterPage implements OnInit, OnDestroy {
  public filterForm: FormGroup;
  public range: any;
  public filter: any;
  private _sbscrs: any[] = [];

  constructor(
    private filterCtrl: FilterController,
    private fb: FormBuilder,
    private dataProvider: DataProvider
  ) {

  }

  ngOnInit() {
    this.subscribe();
  }

  ngOnDestroy(){
    this.unsubscribe();
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      valueRange: new FormControl({
        lower: this.filter['periods.actual'] ? this.filter['periods.actual']['$gt'] : this.range.min,
        upper: this.filter['periods.actual'] ? this.filter['periods.actual']['$lt'] : this.range.max
      })
    });
  }

  subscribe() {
    this._sbscrs.push(this.filterCtrl.currentFilter$.subscribe((f) => {
      this.filter = Object.assign({}, f);

      const filter = Object.assign({}, f);
      delete filter['periods.actual'];

      this.dataProvider.getDataImmediately(filter).then((data: any[]) => {
        const actuals = data.map(d => d.periods.actual);
        this.range = {
          min: Math.min(...actuals) - 1,
          max: Math.max(...actuals) + 1
        }
        if(!this.filterForm){
          this.buildFilterForm();
        }
      });
    }));
  }

  unsubscribe() {
    this._sbscrs.forEach((s: any) => s.unsubscribe());
  }

  saveFilters() {
    const formData = this.filterForm.getRawValue();
    const { lower, upper } = formData.valueRange;

    const filter = { ...this.filter, ...{'periods.actual': { $gt: lower, $lt: upper }} };

    this.filterCtrl.currentFilter$ = filter;
  }
};

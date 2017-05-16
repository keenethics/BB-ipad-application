import { NgModule, Provider } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { DataManagementModule, DataProvider } from '../data-management';

import { FilterControllerT } from './filter-controller';
import { CategoryFilter } from './category-filter/category-filter';
import { RangeFilter } from './range-filter/ragne-filter';
import { PlacesFilter } from './places-filter/places-filter';
import { BuFilterSelect } from './bu-filter/bu-filter-select';
import { BuFilterCalc } from './bu-filter/bu-filter-calc';

const filterControllerFactory = (
  catF: CategoryFilter,
  plF: PlacesFilter,
  rangF: RangeFilter,
  buFCalc: BuFilterCalc,
  buFSel: BuFilterSelect,
  dP: DataProvider
) => new FilterControllerT([catF, plF, buFSel, buFCalc, rangF], dP);

@NgModule({
  imports: [
    IonicModule,
    CommonAppModule,
    DataManagementModule
  ],
  exports: [],
  declarations: [],
  providers: [
    {
      provide: FilterControllerT,
      useFactory: filterControllerFactory,
      deps: [
        BuFilterSelect,
        CategoryFilter,
        PlacesFilter,
        RangeFilter,
        BuFilterCalc,
        DataProvider
      ]
    },
    CategoryFilter,
    RangeFilter,
    PlacesFilter,
    BuFilterSelect,
    BuFilterCalc
  ],
})
export class FilterModule { }

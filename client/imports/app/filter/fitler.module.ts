import { NgModule, Provider } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { DataManagementModule, DataProvider } from '../data-management';

import { FilterControllerT } from './filter-controller';
import { CategoryFilter } from './category-filter/category-filter';
import { RangeFilter } from './range-filter/ragne-filter';

const filterControllerFactory = (catF: CategoryFilter, rangF: RangeFilter, dP: DataProvider) =>
  new FilterControllerT([catF, rangF], dP);

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
      deps: [CategoryFilter, RangeFilter, DataProvider]
    },
    CategoryFilter,
    RangeFilter
  ],
})
export class FilterModule { }

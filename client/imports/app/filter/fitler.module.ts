import { NgModule, Provider } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { DataManagementModule, DataProvider } from '../data-management';

import { FilterControllerT } from './filter-controller';
import { CategoryFilter } from './category-filter/category-filter';
import { RangeFilter } from './range-filter/ragne-filter';
import { PlacesFilter } from './places-filter/places-filter';

const filterControllerFactory = (
  catF: CategoryFilter,
  plF: PlacesFilter,
  rangF: RangeFilter,
  dP: DataProvider
) => new FilterControllerT([catF, plF, rangF], dP);

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
        CategoryFilter,
        PlacesFilter,
        RangeFilter,
        DataProvider
      ]
    },
    CategoryFilter,
    RangeFilter,
    PlacesFilter
  ],
})
export class FilterModule { }

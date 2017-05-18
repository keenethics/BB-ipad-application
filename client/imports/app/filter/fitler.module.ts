import { NgModule, Provider } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { DataManagementModule, DataProvider } from '../data-management';

import { FilterController } from './filter-controller';
import { CategoryFilter } from './category-filter/category-filter';
import { RangeFilter } from './range-filter/ragne-filter';
import { PlacesFilter } from './places-filter/places-filter';
import { CountrySelector } from './places-filter/country-selector';
import { BuFilterSelect } from './bu-filter/bu-filter-select';
import { BuFilterCalc } from './bu-filter/bu-filter-calc';

import { BuTitlesProvider } from './bu-filter/bu-titles-provider';

import { BuFilterComponnet } from './bu-filter/bu-filter.component';
import { AppliedPlacesComponent } from './places-filter/applied-places.component';
import { MainFilterComponent } from './main-filter/main-filter.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { FilterCounterComponent } from './filter-counter/filter-counter.component';
import { RangeFilterComponent } from './range-filter/range-filter.component';

const filterControllerFactory = (
  catF: CategoryFilter,
  plF: PlacesFilter,
  rangF: RangeFilter,
  buFCalc: BuFilterCalc,
  buFSel: BuFilterSelect,
  dP: DataProvider
) => new FilterController([catF, plF, buFSel, buFCalc, rangF], dP);

@NgModule({
  imports: [
    IonicModule,
    CommonAppModule,
    DataManagementModule
  ],
  exports: [
    BuFilterComponnet,
    AppliedPlacesComponent,
    MainFilterComponent,
    CategoryFilterComponent,
    FilterCounterComponent,
    RangeFilterComponent
  ],
  declarations: [
    BuFilterComponnet,
    AppliedPlacesComponent,
    MainFilterComponent,
    CategoryFilterComponent,
    FilterCounterComponent,
    RangeFilterComponent
  ],
  providers: [
    {
      provide: FilterController,
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
    BuFilterCalc,
    CountrySelector,
    BuTitlesProvider
  ],
})
export class FilterModule { }

import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { BuFilterComponnet } from './bu-filter/bu-filter.component';
import { BuFilterPipe } from './bu-filter/bu-filter.pipe';
import { BuTitlesProvider } from './bu-filter/bu-titles-provider';
import { CutPipe } from './bu-filter/cut.pipe';
import { FilterController } from './filter-controller';
import { AppliedFiltersComponent } from './main-filter/applied-filters.component';
import { MainFilterComponent } from './main-filter/main-filter.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { FilterCounterComponent } from './filter-counter/filter-counter.component';
import { ResetFiltersButtonComponent } from './reset-filters-button/reset-filters-button.component';
import { RangeFilterComponent } from './range-filter/range-filter.component';
import { RangeFilterPipe } from './range-filter/range-filter.pipe';
import { RangeFilterController } from './range-filter/range-filter-controller';

@NgModule({
  imports: [
    IonicModule,
    CommonAppModule
  ],
  declarations: [
    BuFilterComponnet,
    MainFilterComponent,
    AppliedFiltersComponent,
    CategoryFilterComponent,
    CutPipe,
    FilterCounterComponent,
    ResetFiltersButtonComponent,
    RangeFilterComponent,
    RangeFilterPipe,
    BuFilterPipe
  ],
  exports: [
    BuFilterComponnet,
    MainFilterComponent,
    CategoryFilterComponent,
    FilterCounterComponent,
    ResetFiltersButtonComponent,
    RangeFilterComponent,
    RangeFilterPipe,
    BuFilterPipe
  ],
  providers: [
    BuTitlesProvider,
    FilterController,
    RangeFilterController
  ]
})
export class FiltersModule { }

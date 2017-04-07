import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { BuFilterComponnet } from './bu-filter/bu-filter.component';
import { BuTitlesProvider } from './bu-filter/bu-titles-provider';
import { CutPipe } from './bu-filter/cut.pipe';
import { FilterController } from './filter-controller';
import { AppliedFiltersComponent } from './main-filter/applied-filters.component';
import { MainFilterComponent } from './main-filter/main-filter.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { FilterCounterComponent } from './filter-counter/filter-counter.component';
import { ResetFiltersButtonComponent } from './reset-filters-button/reset-filters-button.component';

console.log(FilterCounterComponent, ResetFiltersButtonComponent);

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
    ResetFiltersButtonComponent
  ],
  exports: [
    BuFilterComponnet,
    MainFilterComponent,
    CategoryFilterComponent,
    FilterCounterComponent,
    ResetFiltersButtonComponent
  ],
  providers: [
    BuTitlesProvider,
    FilterController
  ]
})
export class FiltersModule { }

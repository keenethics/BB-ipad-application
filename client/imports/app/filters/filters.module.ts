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
    CutPipe
  ],
  exports: [
    BuFilterComponnet,
    MainFilterComponent,
    CategoryFilterComponent
  ],
  providers: [
    BuTitlesProvider,
    FilterController
  ]
})
export class FiltersModule { }

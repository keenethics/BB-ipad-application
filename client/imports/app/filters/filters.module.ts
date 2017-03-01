import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { BuFilterComponnet } from './bu-filter/bu-filter.component';
import { BuFilter } from './bu-filter/bu-filter';
import { CutPipe } from './bu-filter/cut.pipe';
import { FilterController } from './filter-controller';
import { AppliedFiltersComponent } from './data-filter/applied-filters.component';
import { DataFilterComponent } from './data-filter/filter.component';
import { ViewSwitcherComponent } from './view-switcher/view-switcher.component';


@NgModule({
  imports: [
    IonicModule,
    CommonAppModule
  ],
  declarations: [
    BuFilterComponnet,
    DataFilterComponent,
    AppliedFiltersComponent,
    ViewSwitcherComponent,
    CutPipe
  ],
  exports: [
    BuFilterComponnet,
    DataFilterComponent,
    ViewSwitcherComponent
  ],
  providers: [
    BuFilter,
    FilterController
  ]
})
export class FiltersModule { }

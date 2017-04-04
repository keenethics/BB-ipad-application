import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { DataProvider } from './data-provider';
import { DataUploader } from './data-uploader';
import { DataUpdateInfo } from './data-update-info';
// import { DataFilterComponent } from './filter.component';
// import { AppliedFiltersComponent } from './applied-filters.component';
import { AutoHeightDirective } from './auto-height.directive';
import { SumBusinessUnitsPipe } from './sum-bu.pipe';
// import { FilterController } from './filter-controller';

@NgModule({
  imports: [
    IonicModule,
    CommonAppModule
  ],
  providers: [
    DataProvider,
    DataUploader,
    DataUpdateInfo
  ],
  declarations: [AutoHeightDirective, SumBusinessUnitsPipe],
  exports: [AutoHeightDirective, SumBusinessUnitsPipe]
})
export class DataManagementModule {
}

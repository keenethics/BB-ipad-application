import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { DataProvider } from './data-provider';
import { DataUploader } from './data-uploader';
import { DataFilterComponent } from './filter.component';
import { AppliedFiltersComponent } from './applied-filters.component';
import { AutoHeightDirective } from './auto-height.directive';

@NgModule({
  imports: [
    IonicModule,
    CommonAppModule
  ],
  providers: [
    DataProvider,
    DataUploader
  ],
  declarations: [DataFilterComponent, AppliedFiltersComponent, AutoHeightDirective],
  exports: [DataFilterComponent, AppliedFiltersComponent, AutoHeightDirective],
  entryComponents: [DataFilterComponent]
})
export class DataManagementModule {
}

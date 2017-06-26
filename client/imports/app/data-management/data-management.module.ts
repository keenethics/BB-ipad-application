import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { CommonAppModule } from '../common/common-app.module';

import { DataProvider } from './data-provider';
import { DataUploader } from './data-uploader';
import { DataUpdateInfo } from './data-update-info';
import { AutoHeightDirective } from './auto-height.directive';
import { SumBusinessUnitsPipe } from './sum-bu.pipe';

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

import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { DataProvider } from './data-provider';
import { DataUploader } from './data-uploader';
import { DataFilterComponent } from './filter.component';

@NgModule({
  imports: [
    IonicModule
  ],
  providers: [
    DataProvider,
    DataUploader
  ],
  declarations: [DataFilterComponent],
  exports: [DataFilterComponent],
  entryComponents: [DataFilterComponent]
})
export class DataManagementModule {
}

import { NgModule } from '@angular/core';
import { DataProvider } from './data-provider';
import { DataUploader } from './data-uploader';

@NgModule({
  providers: [
    DataProvider,
    DataUploader
  ]
})
export class DataManagementModule {
}

import { NgModule } from '@angular/core';
import { OfflineDataProvider } from './offline-data-provider';
import { StorageManager } from './storage-manager';

@NgModule({
  providers: [OfflineDataProvider, StorageManager],
})
export class OfflineModule { }

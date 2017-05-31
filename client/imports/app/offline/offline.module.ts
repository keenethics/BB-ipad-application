import { NgModule } from '@angular/core';
import { LocalCollectionsManager } from './local-collections-manager';
import { OfflineDataProvider } from './offline-data-provider';

@NgModule({
  providers: [LocalCollectionsManager, OfflineDataProvider],
})
export class OfflineModule { }

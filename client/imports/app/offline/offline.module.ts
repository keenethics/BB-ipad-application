import { NgModule } from '@angular/core';
import { LocalCollectionsManager } from './local-collections-manager';

@NgModule({
  providers: [LocalCollectionsManager],
})
export class OfflineModule { }

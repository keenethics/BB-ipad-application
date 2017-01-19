import { NgModule } from '@angular/core';
import { ToastsManager } from './toasts-manager';
import { LoadingManager } from './loading-manager';

import { ObjectAsArray } from './pipes/objectAsArray.pipe';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  providers: [
    ToastsManager,
    LoadingManager
  ],
  declarations: [
    ObjectAsArray,
    SearchPipe
  ],
  exports: [
    ObjectAsArray,
    SearchPipe
  ]
})
export class CommonAppModule {
}

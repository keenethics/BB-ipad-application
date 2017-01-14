import { NgModule } from '@angular/core';
import { ToastsManager } from './toasts-manager';
import { LoadingManager } from './loading-manager';

import { ObjectAsArray } from './pipes/objectAsArray.pipe';

@NgModule({
  providers: [
    ToastsManager,
    LoadingManager
  ],
  declarations: [
    ObjectAsArray
  ],
  exports: [
    ObjectAsArray
  ]
})
export class CommonAppModule {
}

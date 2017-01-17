import { NgModule } from '@angular/core';
import { ToastsManager } from './toasts-manager';
import { LoadingManager } from './loading-manager';

import { ObjectAsArray } from './pipes/objectAsArray.pipe';
import { Draggable } from './directives/draggable';

@NgModule({
  providers: [
    ToastsManager,
    LoadingManager
  ],
  declarations: [
    Draggable,
    ObjectAsArray
  ],
  exports: [
    Draggable,
    ObjectAsArray
  ]
})
export class CommonAppModule {
}

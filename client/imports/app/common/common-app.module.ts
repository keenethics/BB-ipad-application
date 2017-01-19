import { NgModule } from '@angular/core';
import { ToastsManager } from './toasts-manager';
import { LoadingManager } from './loading-manager';

import { ObjectAsArray } from './pipes/objectAsArray.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { Draggable } from './directives/draggable';

@NgModule({
  providers: [
    ToastsManager,
    LoadingManager
  ],
  declarations: [
    ObjectAsArray,
    SearchPipe,
    Draggable
  ],
  exports: [
    ObjectAsArray,
    SearchPipe,
    Draggable
  ]
})
export class CommonAppModule {
}

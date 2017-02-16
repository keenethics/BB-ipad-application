import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { ToastsManager } from './toasts-manager';
import { LoadingManager } from './loading-manager';

import { ObjectAsArray } from './pipes/objectAsArray.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { ExcludePipe } from './pipes/exclude.pipe';

import { Draggable } from './directives/draggable';
import { DebounceClick } from './directives/debounceClick';

@NgModule({
  imports: [
    IonicModule
  ],
  providers: [
    ToastsManager,
    LoadingManager
  ],
  declarations: [
    ObjectAsArray,
    SearchPipe,
    Draggable,
    ExcludePipe,
    DebounceClick,
  ],
  exports: [
    ObjectAsArray,
    SearchPipe,
    Draggable,
    ExcludePipe,
    DebounceClick,
  ]
})
export class CommonAppModule {
}

import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NotificationsModule } from '../notifications';

import { ToastsManager } from './toasts-manager';
import { LoadingManager } from './loading-manager';

import { ObjectAsArray } from './pipes/objectAsArray.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { ExcludePipe } from './pipes/exclude.pipe';

import { Draggable } from './directives/draggable';
import { DebounceClick } from './directives/debounceClick';

import { PickFileComponent } from './components/pick-file/pick-file.component';
import { SepPipe } from './pipes/comma-separator.pipe';

@NgModule({
  imports: [
    IonicModule,
    NotificationsModule
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
    PickFileComponent,
    SepPipe
  ],
  exports: [
    ObjectAsArray,
    SearchPipe,
    Draggable,
    ExcludePipe,
    DebounceClick,
    PickFileComponent,
    SepPipe,
    NotificationsModule
  ]
})
export class CommonAppModule {
}

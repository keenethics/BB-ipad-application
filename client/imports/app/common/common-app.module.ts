import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NotificationsModule } from '../notifications';

import { ToastsManager } from './toasts-manager';
import { LoadingManager } from './loading-manager';
import { WindowSize } from './window-size';

import { ObjectAsArray } from './pipes/objectAsArray.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { ExcludePipe } from './pipes/exclude.pipe';

import { Draggable } from './directives/draggable';
import { DebounceClick } from './directives/debounceClick';
import { VerticalCenter } from './directives/vertical-center';

import { PickFileComponent } from './components/pick-file/pick-file.component';
import { SepPipe } from './pipes/comma-separator.pipe';

@NgModule({
  imports: [
    IonicModule,
    NotificationsModule
  ],
  providers: [
    ToastsManager,
    LoadingManager,
    WindowSize
  ],
  declarations: [
    ObjectAsArray,
    SearchPipe,
    Draggable,
    ExcludePipe,
    DebounceClick,
    PickFileComponent,
    SepPipe,
    VerticalCenter
  ],
  exports: [
    ObjectAsArray,
    SearchPipe,
    Draggable,
    ExcludePipe,
    DebounceClick,
    PickFileComponent,
    SepPipe,
    VerticalCenter,
    NotificationsModule
  ]
})
export class CommonAppModule {
}

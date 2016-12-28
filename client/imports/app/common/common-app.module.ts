import { NgModule } from '@angular/core';
import { ToastsManager } from './toasts-manager';
import { LoadingManager } from './loading-manager';

@NgModule({
  providers: [
    ToastsManager,
    LoadingManager
  ]
})
export class CommonAppModule {
}

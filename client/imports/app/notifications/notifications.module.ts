import { NgModule } from '@angular/core';
import { TextProvider } from './text-provider';
import { TextPipe } from './text.pipe';
@NgModule({
  declarations: [
    TextPipe
  ],
  exports: [
    TextPipe
  ],
  providers: [
    TextProvider
  ]
})
export class NotificationsModule {

}

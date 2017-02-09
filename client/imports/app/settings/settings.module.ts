import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { CommonAppModule } from '../common/common-app.module';
import { ProfileSettings } from './profile-settings';

const COMPONENTS: any[] = [];

const PIPES: any[] = [];

const DIRECTIVES: any[] = [];

const PROVIDERS: any[] = [
  ProfileSettings
];

@NgModule({
  imports: [IonicModule, CommonAppModule],
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  entryComponents: [...COMPONENTS],
  providers: [...PROVIDERS]
})
export class SettingsModule { }

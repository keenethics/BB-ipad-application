import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { CommonAppModule } from '../common/common-app.module';

import { OverviewSheetComponent } from './overview-sheet.component';
import { FactSheetComponent } from './fact-sheet.component';
import { SheetsPortalComponent } from './sheets-portal.component';
import { SheetsController } from './sheets-controller';

const COMPONENTS = [
  OverviewSheetComponent,
  FactSheetComponent,
  SheetsPortalComponent
];

@NgModule({
  imports: [IonicModule, CommonAppModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  providers: [SheetsController]
})
export class SheetsModule { }

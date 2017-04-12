import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { CommonAppModule } from '../common/common-app.module';

import { OverviewSheetComponent } from './overview-sheet.component';
import { FactSheetComponent } from './fact-sheet.component';
import { SheetsPortalComponent } from './sheets-portal.component';
import { SheetsController } from './sheets-controller';
import { PercentagePipe } from './percentage.pipe';
import { ColoredDirective } from './colored.directive';
import { WaterfallChartComponent } from './waterfall-chart/waterfall-chart.component';

const COMPONENTS = [
  OverviewSheetComponent,
  FactSheetComponent,
  SheetsPortalComponent,
  WaterfallChartComponent
];

const PIPES = [
  PercentagePipe
];

const DIRECTIVES = [
  ColoredDirective
];

@NgModule({
  imports: [IonicModule, CommonAppModule],
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  entryComponents: [...COMPONENTS],
  providers: [SheetsController]
})
export class SheetsModule { }

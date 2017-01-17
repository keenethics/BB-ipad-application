import {
  Injectable,
  ViewContainerRef,
  ReflectiveInjector,
  ComponentFactoryResolver,
  ComponentRef
} from '@angular/core';

import { SheetsPortalComponent } from './sheets-portal.component';
import { OverviewSheetComponent } from './overview-sheet.component';
import { FactSheetComponent } from './fact-sheet.component';

import { BusinessDataUnit } from '../../../../both/data-management/business-data.collection';

@Injectable()
export class SheetsController {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  public create(sheetType: any, vCref: ViewContainerRef): ComponentRef<SheetsPortalComponent | OverviewSheetComponent> {
    if (
      (sheetType === FactSheetComponent) ||
      (sheetType === OverviewSheetComponent)
    ) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(sheetType);
      const injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);
      const componet = factory.create(injector);
      vCref.insert(componet.hostView);
      return componet;
    }

    return null;
  }
}

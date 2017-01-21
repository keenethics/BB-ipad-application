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

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {

  }

  public create(sheetType: any, vCref: ViewContainerRef, dataUnit: BusinessDataUnit): ComponentRef<FactSheetComponent | OverviewSheetComponent> {
    if (
      (sheetType === FactSheetComponent) ||
      (sheetType === OverviewSheetComponent)
    ) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(sheetType);
      const injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);
      const componet = factory.create(injector) as ComponentRef<FactSheetComponent | OverviewSheetComponent>;
      componet.instance.selectedItem = dataUnit;
      vCref.insert(componet.hostView);

      componet.instance.onCloseEmitter.subscribe(() => {
        componet.destroy();
      });

      if (componet.componentType === OverviewSheetComponent) {
        (componet as ComponentRef<OverviewSheetComponent>)
          .instance.onClickEmitter.subscribe(() => {
            this.create(FactSheetComponent, vCref, dataUnit);
            componet.destroy();
          });
      }

      return componet;
    }

    return null;
  }
}

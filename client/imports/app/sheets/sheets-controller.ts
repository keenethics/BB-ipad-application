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

  private overviewSheets: ComponentRef<OverviewSheetComponent>[] = [];
  private factSheets: ComponentRef<FactSheetComponent>[] = [];

  public create(sheetType: any, vCref: ViewContainerRef, eventData: { data: BusinessDataUnit, element: HTMLElement }): ComponentRef<FactSheetComponent | OverviewSheetComponent> {
    if (
      (sheetType === FactSheetComponent) ||
      (sheetType === OverviewSheetComponent)
    ) {

      if (sheetType === OverviewSheetComponent &&
        this.overviewSheets.length) {
        this.overviewSheets[0].destroy();
        this.overviewSheets.pop();
      }

      if (this.factSheets.length) {
        this.factSheets[0].instance.selectedItem = eventData.data;
        this.factSheets[0].instance.getTableData();
      }

      const factory = this.componentFactoryResolver.resolveComponentFactory(sheetType);
      const injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);
      const component = factory.create(injector) as ComponentRef<FactSheetComponent | OverviewSheetComponent>;

      const { left, top, width, height } = eventData.element.getBoundingClientRect();
      component.instance.selectedItem = eventData.data;
      component.instance.options = { top: top + height, left: left + width };

      vCref.insert(component.hostView);

      component.instance.onCloseEmitter.subscribe(() => {
        if (component.componentType === FactSheetComponent &&
          this.factSheets.length) {
          this.factSheets.pop();
        }
        component.destroy();
      });

      if (component.componentType === OverviewSheetComponent) {
        (component as ComponentRef<OverviewSheetComponent>)
          .instance.onClickEmitter.subscribe(() => {
            if (this.factSheets.length) {
              this.factSheets[0].instance.selectedItem = eventData.data;
              this.factSheets[0].instance.getTableData();
            } else {
              this.create(FactSheetComponent, vCref, eventData);
              component.destroy();
            }
          });

        this.overviewSheets.push(component as ComponentRef<OverviewSheetComponent>);
      }

      if (component.componentType === FactSheetComponent) {
        this.factSheets.push(component as ComponentRef<FactSheetComponent>);
      }

      return component;
    }

    return null;
  }
}

import {
  Injectable,
  ViewContainerRef,
  ReflectiveInjector,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter
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

  public onSheetDestroy = new EventEmitter();

  public create(sheetType: any, vCref: ViewContainerRef, eventData: { data: BusinessDataUnit, element: HTMLElement }): ComponentRef<FactSheetComponent | OverviewSheetComponent> {
    if (
      (sheetType === FactSheetComponent) ||
      (sheetType === OverviewSheetComponent)
    ) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(sheetType);
      const injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);
      const component = factory.create(injector) as ComponentRef<FactSheetComponent | OverviewSheetComponent>;

      const { left, top, width, height } = eventData.element.getBoundingClientRect();
      component.instance.selectedItem = eventData.data;
      component.instance.options = { top: top + height, left: left + width };

      vCref.insert(component.hostView);

      component.instance.onCloseEmitter.subscribe(() => {
        component.destroy();
        this.onSheetDestroy.emit();
      });

      component.instance.onClickEmitter.subscribe((type: any) => {
        if (type === OverviewSheetComponent) {
          this.create(OverviewSheetComponent, vCref, eventData);
          component.destroy();
        } else if (type === FactSheetComponent) {
          this.create(FactSheetComponent, vCref, eventData);
          component.destroy();
        }
      });

      return component;
    }

    return null;
  }
}

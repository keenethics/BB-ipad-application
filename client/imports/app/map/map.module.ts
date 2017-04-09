import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { WorldMap } from './world-map.component';
import { MapSwitchers } from './switchers/switchers.component';
import { MarketCountriesProvider } from './countries/market-countries';
import { CommonAppModule } from '../common';

import { MapComponent } from './map.component';

@NgModule({
  imports: [
    IonicModule,
    CommonAppModule
  ],
  declarations: [
    WorldMap,
    MapSwitchers,
    MapComponent
  ],
  exports: [
    WorldMap,
    MapSwitchers,
    MapComponent
  ],
  providers: [
    MarketCountriesProvider
  ]
})
export class MapModule {
}

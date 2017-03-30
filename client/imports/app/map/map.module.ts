import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { WorldMap } from './world-map.component';
import { MapSwitchers } from './switchers/switchers.component';
import { MarketCountriesProvider } from './countries/market-countries';
import { CommonAppModule } from '../common';

@NgModule({
  imports: [
    IonicModule,
    CommonAppModule
  ],
  declarations: [
    WorldMap,
    MapSwitchers
  ],
  exports: [
    WorldMap,
    MapSwitchers
  ],
  providers: [
    MarketCountriesProvider
  ]
})
export class MapModule {
}

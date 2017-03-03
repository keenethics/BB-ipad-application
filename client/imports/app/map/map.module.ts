import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { WorldMap } from './world-map.component';
import { MapSwichers } from './swichers/swichers.component';
import { MarketCountriesProvider } from './countries/market-countries';
import { CommonAppModule } from '../common';

@NgModule({
  imports: [
    IonicModule,
    CommonAppModule
  ],
  declarations: [
    WorldMap,
    MapSwichers
  ],
  exports: [
    WorldMap,
    MapSwichers
  ],
  providers: [
    MarketCountriesProvider
  ]
})
export class MapModule {
}

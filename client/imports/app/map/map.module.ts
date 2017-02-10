import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { WorldMap } from './world-map.component';
import { MapSwichers } from './swichers/swichers.component';

@NgModule({
  imports: [
    IonicModule
  ],
  declarations: [
    WorldMap,
    MapSwichers
  ],
  exports: [
    WorldMap,
    MapSwichers
  ]
})
export class MapModule {
}

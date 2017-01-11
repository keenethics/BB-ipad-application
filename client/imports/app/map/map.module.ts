import { NgModule } from '@angular/core';

import { WorldMap } from './world-map.component';

@NgModule({
  declarations: [
    WorldMap
  ],
  exports: [
    WorldMap
  ]
})
export class MapModule {
}

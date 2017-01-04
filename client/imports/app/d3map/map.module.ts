import { NgModule } from '@angular/core';

import { D3MAP_DECLARATIONS } from './';

@NgModule({
  declarations: [
    ...D3MAP_DECLARATIONS
  ],
  exports: [
    ...D3MAP_DECLARATIONS
  ]
})
export class MapModule {
}

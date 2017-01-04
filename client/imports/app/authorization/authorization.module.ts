import { NgModule } from '@angular/core';
import { Authorization } from './authorization';
import { RolesController } from './roles-controller';

@NgModule({
  providers: [
    Authorization,
    RolesController
  ]
})
export class AuthorizationModule {
}

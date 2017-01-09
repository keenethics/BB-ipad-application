import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';
 
import { D3MapComponent } from './d3map/d3map.component';
import { HomeComponent } from './home/home.component';
import { SiteUploadComponent } from './site/site.upload.component';
import { UsersComponent } from './users/users.component';

import { AuthGuardD3 } from './guards/index';
import { AuthGuardHome } from './guards/index';

export const routes: Route[] = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardHome]},
  { path: 'd3map', component: D3MapComponent,canActivate: [AuthGuardD3]},
  { path: 'site', component: SiteUploadComponent, canActivate: [AuthGuardD3]},
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardD3]},
  { path: '**', redirectTo: '' }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => {
  	return !! Meteor.userId()
  }
}];


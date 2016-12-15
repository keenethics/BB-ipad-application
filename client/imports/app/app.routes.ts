import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';
 
import { D3MapComponent } from './d3map/d3map.component';
import { HomeComponent } from './home/home.component';

import { AuthGuardD3 } from './guards/index';
import { AuthGuardHome } from './guards/index';

export const routes: Route[] = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardHome]},
  { path: 'd3map', component: D3MapComponent,canActivate: [AuthGuardD3]},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => {
  	return !! Meteor.userId()
  }
}];


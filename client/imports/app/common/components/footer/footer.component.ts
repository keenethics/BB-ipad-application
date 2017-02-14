import {
  Component,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { NavController } from 'ionic-angular';
import { RolesController } from '../../../authorization';

import template from './footer.component.html';

@Component({
  selector: 'footer',
  template
})
export class FooterComponent {
  @Input('activeButtonTitle') activeButtonTitle: string;
  @Input('pages') pages: any;
  @Input('preventNav') preventNavArr: string[] = [];
  @Output('onSelect') onSelect = new EventEmitter();

  constructor(
    private navCtrl: NavController,
    private roles: RolesController) {
  }

  selectPage(event: any) {
    if (this.preventNavArr.indexOf(event.value) === -1) {
      switch (event.value) {
        case 'home': this.navCtrl.setRoot(this.pages.home); break;
        case 'swichers': this.navCtrl.setRoot(this.pages.swichers); break;
        case 'profile-settings': this.navCtrl.setRoot(this.pages.profileSettings); break;
        case 'user-management': this.navCtrl.setRoot(this.pages.userManagement); break;
      }
    }

    this.onSelect.emit(event.value);
  }

  isAdmin() {
    return this.roles.userIsInRole(Meteor.userId(), 'Administrator');
  }
}

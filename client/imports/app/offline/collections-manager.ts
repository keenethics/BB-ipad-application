import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';

@Injectable()
export class CollectionsManager {
  constructor() {
    MeteorObservable.autorun().subscribe(() => {
      console.log({...Meteor.status()});
    });
  }
}

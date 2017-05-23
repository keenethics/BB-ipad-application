import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OfflineDataProvider } from '../../offline/offline-data-provider';
import { UnitsTitles } from '../../../../../both/data-management';

@Injectable()
export class BuTitlesProvider {
  private buTitles = new BehaviorSubject([]);
  private subscr: Subscription;
  public titlesMap: Map<string, string>;

  constructor(private _odp: OfflineDataProvider) {
    this.getBuTitles();
    this.titlesMap = new Map([
      ['Total', 'MN'],
      ['Global Services', 'GS'],
      ['MN Products-RN', 'P'],
      ['MN Products-CC', 'CC'],
      ['Advanced MN Solutions', 'AMS'],
      ['Product Portfolio Sales', 'PPS'],
      ['Services Portfolio Sales', 'SPS'],
      ['COO', 'COO'],
      ['Commercial Management', 'CM'],
      ['CTO', 'CTO'],
      ['Central Team', 'MGMT']
    ]);
  }

  getBuTitles() {
    this._odp.findIn(UnitsTitles, {}, 'unitsTitles')
      .then((titles: any[]) => {
        const mapedTitles = Array.from(this.titlesMap)
          .reduce((acc: any[], item: any) => {
            if (!~titles.indexOf(item[0])) {
              acc.push({ value: item[0], title: item[1] });
            }
            return acc;
          }, []);
        this.buTitles.next(mapedTitles);
      });
  }

  public get buTitles$() {
    return this.buTitles.asObservable();
  }
}

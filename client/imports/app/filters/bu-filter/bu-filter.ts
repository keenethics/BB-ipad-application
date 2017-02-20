import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UnitsTitles } from '../../../../../both/data-management';

@Injectable()
export class BuFilter {
  private buTitles = new BehaviorSubject([]);
  private subscr: Subscription;
  public titlesMap: Map<string, string>;

  constructor() {
    this.subscribe();
    this.titlesMap = new Map([
      ['Total', 'MN'],
      ['Services Portfolio Sales', 'SPS'],
      ['MN Products-RN', 'P'],
      ['CTO', 'CTO'],
      ['Product Portfolio Sales', 'PPS'],
      ['Commercial Management', 'CM'],
      ['MN Products-CC', 'CC'],
      ['COO', 'COO'],
      ['Global Services', 'GS'],
      ['Central Team', 'OTHERS'],
      ['Business and Portfolio Integration Leadership', 'OTHERS'],
      ['Advanced MN Solutions', 'AMS']
    ]);
  }

  private subscribe() {
    this.subscr = MeteorObservable
      .subscribe('unitsTitles')
      .subscribe(() => {
        const titles = UnitsTitles.find().fetch();
        const mapedTitles = titles
          .reduce((acc: any[], item: any) => {
            acc.push({ value: item.title, title: this.titlesMap.get(item.title) });
            return acc;
          }, []);

        const mergedOthers = mapedTitles
          .filter((item: any) => item.title === 'OTHERS')
          .reduce((acc: any, item: any) => {
            acc.value.push(item.value);
            return acc;
          }, { title: 'OTHERS', value: [] });

        const result = [...mapedTitles.filter((item: any) => item.title !== 'OTHERS'), mergedOthers];
        this.buTitles.next(result);
      });
  }

  public unsubscribe() {
    this.subscr.unsubscribe();
  }

  public get buTitles$() {
    return this.buTitles.asObservable();
  }
}

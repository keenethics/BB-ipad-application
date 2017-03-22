import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class TextProvider {
  private _notifications: any;

  constructor(private http: Http) {
    this._getJsonFile();
  }

  text(key: string) {
    return this._notifications ? this._notifications[key] || key : '';
  }

  private _getJsonFile() {
    this.http.get('/notifications/notifications.json')
      .subscribe((result: Response) => {
        this._notifications = result.json();
      });
  }
}

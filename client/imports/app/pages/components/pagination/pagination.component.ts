import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges
} from '@angular/core';

import template from './pagination.component.html';

@Component({
  selector: 'pagination',
  template
})
export class PaginationComponent implements OnChanges {
  public pages: any[] = [];

  @Input('allUsersCount') usersCount: number;
  @Input('limit') limit: number = 5;
  @Input('currentPage') currentPage: number = 1;
  @Output('onSelect') onSelect = new EventEmitter();

  ngOnChanges(changes: any) {
    if (changes.usersCount.currentValue) {
      const pagesCount = this.usersCount / this.limit;
      this.pages = [];
      for (let i = 0; i < pagesCount; i++) {
        this.pages.push({ index: i + 1, skip: i * this.limit });
      }
    }
  }

  selectPage(page: any) {
    this.onSelect.emit(page.skip);
    this.currentPage = page.index;
  }
}

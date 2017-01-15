import {
  Component,
  OnChanges,
  Output,
  Input,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'applied-filters',
  template: `
    <ion-chip *ngFor="let f of filters">
      <ion-label>{{f}}</ion-label>
      <button ion-button (click)="removeFilter(f)">
        <ion-icon name="close"></ion-icon>
      </button>
    </ion-chip>
  `,
  styles: [`
    ion-chip {
      margin: 0 4px;
    }
  `]
})
export class AppliedFiltersComponent {
  @Input() filters: string[];
  @Output() onFilterRemoved = new EventEmitter();

  removeFilter(filter: string) {
    this.onFilterRemoved.emit(filter);
  }
}

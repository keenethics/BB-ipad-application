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
    <ion-chip *ngFor="let f of filters" [ngStyle]="{'background-color': getColor(f)}">
      <ion-label>{{f.label}}</ion-label>
      <button ion-button (click)="removeFilter(f)">
        <ion-icon name="close"></ion-icon>
      </button>
    </ion-chip>
  `,
  styles: [`
    ion-chip {
      margin: 4px;
    }
  `]
})
export class AppliedFiltersComponent {
  @Input() filters: string[];
  @Output() onFilterRemoved = new EventEmitter();

  removeFilter(filter: string) {
    this.onFilterRemoved.emit(filter);
  }

  getColor({ category }: { category: string }) {
    switch (category) {
      case 'city': return '#395FFF';
      case 'country': return '#5A77F7';
      case 'market': return '#1540FF';
    }
    return 'transparent';
  }
}

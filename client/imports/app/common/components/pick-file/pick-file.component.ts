import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import template from './pick-file.component.html';

@Component({
  selector: 'pick-file',
  template
})
export class PickFileComponent implements AfterViewInit {
  private onClickSbscr: Subscription;

  @Input('emitterElement') emitterElement: any;
  @Input('fileType') fileType: string;
  @Input('validator') validator: Function;

  @Output('onFileSelected') onFileSelected = new EventEmitter();
  @Output('onWrongType') onWrongType = new EventEmitter();

  @ViewChild('file') fileInput: any;

  constructor(
    private elemRef: ElementRef
  ) {
  }

  ngAfterViewInit() {
    if (this.emitterElement) {
      const target = this.emitterElement._elementRef.nativeElement || this.emitterElement;
      const onClick = Observable.fromEvent(target, 'click');
      this.onClickSbscr = onClick.subscribe(() => {
        this.select();
      });
    }
  }

  ngOnDestroy() {
    this.onClickSbscr.unsubscribe();
  }

  select() {
    this.clear();
    (this.fileInput.nativeElement as HTMLInputElement).click();
  }

  clear() {
    (this.fileInput.nativeElement as HTMLInputElement).value = '';
  }

  onChange(event: Event) {
    const file = (event.target as HTMLInputElement).files.length && (event.target as HTMLInputElement).files[0];
    if (file) {
      if (this.validator) {
        if (!this.validator(event.target)) {
          this.onWrongType.emit();
          return;
        }
      }

      this.onFileSelected.emit(file);
    }
  }
}

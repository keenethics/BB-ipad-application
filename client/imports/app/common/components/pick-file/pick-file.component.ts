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
        (this.fileInput.nativeElement as HTMLInputElement).click();
      });
    }
  }

  ngOnDestroy() {
    this.onClickSbscr.unsubscribe();
  }

  onChange(event: Event) {
    const file = (event.target as HTMLInputElement).files.length && (event.target as HTMLInputElement).files[0];
    if (file) {
      if (this.fileType && (this.fileType !== file.type)) {
        this.onWrongType.emit(file);
        return;
      }
      this.onFileSelected.emit(file);
    }
  }
}

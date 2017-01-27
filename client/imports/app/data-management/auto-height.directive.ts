import {
  HostListener,
  Directive,
  EventEmitter,
  ElementRef,
  OnInit,
  Output,
  Input
} from '@angular/core';

@Directive({
  selector: '[autho-height]'
})
export class AutoHeightDirective implements OnInit {
  private nativeElement: HTMLElement;

  constructor(private elRef: ElementRef) {
    this.nativeElement = this.elRef.nativeElement;
  }

  ngOnInit() {
    this.nativeElement.style.height = '260px';
  }

  @HostListener('window:resize', ['$event'])
  handleWindowResize(event: MouseEvent) {
    this.setHeight();
  }

  private setHeight() {
    const windowHeight = document.body.clientHeight;
    const {top} = this.nativeElement.getBoundingClientRect();
    this.nativeElement.style.height = windowHeight - top + 'px';
  }
}

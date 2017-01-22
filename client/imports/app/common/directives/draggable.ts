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
  selector: '[draggable]'
})
export class Draggable implements OnInit {
  private isMouseDown = false;
  private nativeElement: HTMLElement;
  private top: number;
  private left: number;

  @Input('init-left') initLeft: any;
  @Input('init-top') initTop: any;

  constructor(private elRef: ElementRef) {
    this.nativeElement = this.elRef.nativeElement;
  }

  ngOnInit() {
    this.nativeElement.style.cursor = 'move';
    this.nativeElement.style.position = 'fixed';

    this.nativeElement.style.left = this.initLeft + 'px';
    this.nativeElement.style.top = this.initTop + 'px';
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  handleMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    this.top = event.pageY - this.nativeElement.offsetTop;
    this.left = event.pageX - this.nativeElement.offsetLeft;
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  handleMouseUp(event: MouseEvent) {
    this.isMouseDown = false;
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if (this.isMouseDown) {
      event.preventDefault();
      this.nativeElement.style.left = event.pageX - this.left + 'px';
      this.nativeElement.style.top = event.pageY - this.top + 'px';
    }
  }
}

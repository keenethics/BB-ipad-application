import {
  HostListener,
  Directive,
  EventEmitter,
  ElementRef,
  OnInit,
  Output
} from '@angular/core';

@Directive({
  selector: '[draggable]'
})
export class Draggable implements OnInit {
  private isMouseDown = false;
  private nativeElement: HTMLElement;
  private initTop: number;
  private initLeft: number;

  constructor(private elRef: ElementRef) {
    this.nativeElement = this.elRef.nativeElement;
  }

  ngOnInit() {
    this.nativeElement.style.cursor = 'move';
    this.nativeElement.style.position = 'fixed';
  }

  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    this.initTop = event.pageY - this.nativeElement.offsetTop;
    this.initLeft = event.pageX - this.nativeElement.offsetLeft;
  }

  @HostListener('mouseup')
  handleMouseUp(event: MouseEvent) {
    this.isMouseDown = false;
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if (this.isMouseDown) {
      event.preventDefault();
      this.nativeElement.style.left = event.pageX - this.initLeft + 'px';
      this.nativeElement.style.top = event.pageY - this.initTop + 'px';
    }
  }
}

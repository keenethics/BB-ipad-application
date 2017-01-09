import { Component, Input } from '@angular/core';

import template from './d3map.fsc.component.html';
import style from './d3map.fsc.component.scss';

@Component({
  selector: 'fsc',
  template,
  styles: [ style ]
})
export class D3MapFSCComponent {  
  @Input() private fsc = {}

  heatmap(val){
    return 'hm_' + val
  }
}
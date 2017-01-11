import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';

import * as mapTopoJson from './json/world.json';

import template from './world-map.component.html';
import styles from './world-map.component.scss';

@Component({
  selector: 'world-map',
  styles: [styles],
  encapsulation: ViewEncapsulation.None,
  template
})
export class WorldMap implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  private isMapDrawed: boolean;
  svg: SVGElement;
  public width: number;
  public height: number;

  @Input('map-width') svgWidth: Function;
  @Input('map-height') svgHeight: Function;
  @ViewChild('map') private mapRef: ElementRef;

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.svg = this.mapRef.nativeElement;
  }

  ngOnChanges(changes: any) {
    if (
      typeof changes.svgWidth.currentValue === 'function'
      && typeof changes.svgHeight.currentValue === 'function'
      && !this.isMapDrawed) {
      this.width = this.svgWidth();
      this.height = this.svgHeight();
      this.drawMap();
    }
  }

  ngOnDestroy() {

  }

  drawMap() {
    const d3svg = d3.select('svg#map');

    const projection = d3.geoMercator()
      .scale((this.svgWidth() - 1) / 2 / Math.PI)
      .translate([this.svgWidth() / 2, this.svgHeight() / 2]);

    const path = d3.geoPath(projection);

    d3svg.append('g')
      .attr('id', 'countries')
      .selectAll('path')
      .data(topojson.feature(mapTopoJson, mapTopoJson.objects.countries).features)
      .enter()
      .append('path')
      .attr('d', path);

    // d3svg.select('g')
    //   .selectAll('.place-label')
    //   .data(topojson.feature(mapTopoJson, mapTopoJson.objects.places).features)
    //   .enter()
    //   .append('text')
    //   .attr('class', 'place-label')
    //   .attr('transform', (d: any) => `translate(${projection(d.geometry.coordinates)} )`)
    //   .attr('dy', '0')
    //   .text((d: any) => d.properties.name);

    const zoom = d3.zoom()
      .scaleExtent([1, 20])
      .on('zoom', () => {
        const { x, y, k } = d3.event.transform;
        d3svg.select('g')
          .attr('transform', `translate(${x}, ${y})scale(${k})`);
      });

    d3svg.call(zoom);
  }

  drawRegions() {
    const d3svg = d3.select('svg#map');
  }
}

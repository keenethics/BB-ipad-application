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
  private projection: d3.GeoProjection;
  private svg: d3.Selection<any, {}, HTMLElement, any>;
  private mapPath: d3.ValueFn<any, any, any>;
  private isMapReady: boolean = false;

  width: number;
  height: number;

  @Input('map-width') svgWidth: Function;
  @Input('map-height') svgHeight: Function;
  @Input('data-to-draw') dataToDraw: any[];

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: any) {
    if (
      changes.svgWidth && changes.svgHeight &&
      typeof changes.svgWidth.currentValue === 'function' &&
      typeof changes.svgHeight.currentValue === 'function') {
      this.width = this.svgWidth();
      this.height = this.svgHeight();
      this.initMap();
      this.drawMap();
    }

    if (changes.dataToDraw) {
      this.drawMarkets(1);
    }
  }

  ngOnDestroy() {

  }

  initMap() {
    if (!this.isMapReady) {
      this.svg = d3.select('svg#map');

      this.projection = d3.geoMercator()
        .scale((this.svgWidth() - 1) / 2 / Math.PI)
        .translate([this.svgWidth() / 2, this.svgHeight() / 2]);

      this.mapPath = d3.geoPath(this.projection);

      const zoom = d3.zoom()
        .scaleExtent([1, 20])
        .on('zoom', () => {
          const { x, y, k } = d3.event.transform;
          const g = this.svg.select('g');
          g.attr('transform', `translate(${x}, ${y})scale(${k})`);
          this.drawMarkets(k);
        });

      this.svg.call(zoom);
      this.isMapReady = true;
    }
  }

  drawMap() {
    if (this.isMapReady) {
      this.svg.append('g')
        .attr('class', 'map')
        .selectAll('path')
        .data(topojson.feature(mapTopoJson, mapTopoJson.objects.countries).features)
        .enter()
        .append('path')
        .attr('d', this.mapPath);
      // .on('click', (d: any) => {
      //   const g = this.svg.select('g');
      //   const path = d3.geoPath().projection(this.projection);
      //   let x;
      //   let y;
      //   let k;
      //   let centroid = path.centroid(d);

      //   if (d && centered !== d) {
      //     centroid = path.centroid(d);
      //     x = centroid[0];
      //     y = centroid[1];
      //     k = 4;
      //     centered = d;
      //   } else {
      //     x = this.width / 2;
      //     y = this.height / 2;
      //     k = 1;
      //     centered = null;
      //   }

      //   g.selectAll('path')
      //     .classed('active', centered && function (d: any) { return d === centered; });

      //   g.transition()
      //     .duration(750)
      //     .attr('transform', "translate(" + this.width / 2 + "," + this.height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      //     .style("stroke-width", 1.5 / k + "px");
      // });
    }
  }

  drawMarkets(scale: number) {
    if (this.isMapReady) {
      const map = this.svg.select('g.map');

      const data = this.dataToDraw.filter((item) => {
        return Boolean(item.value);
      });

      const ranges = data.map((item) => {
        return parseInt(item.value);
      });

      const getRadius = d3.scaleLinear()
        .domain([d3.min(ranges), d3.max(ranges)])
        .range([5, 25])
        .clamp(true);

      if (this.svg.selectAll('circle.site').empty()) {
        map.selectAll('circle.site')
          .data(data)
          .enter()
          .append('circle')
          .attr('class', 'site')
          .attr('transform', (d: any) => `translate(${this.projection([d.longitude, d.latitude])})`)
          .attr('r', (d: any) => getRadius(parseInt(d.value)) / scale);
      } else {
        map.selectAll('circle.site')
          .attr('r', (d: any) => getRadius(parseInt(d.value)) / scale)
          .style('stroke-width', (1 / scale));
      }
    }
  }
}

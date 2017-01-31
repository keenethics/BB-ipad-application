import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  Renderer,
  NgZone,
  HostListener
} from '@angular/core';
import * as d3 from 'd3';
import * as d3proj from 'd3-geo-projection';
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
export class WorldMap implements OnChanges {
  private projection: d3.GeoProjection;
  private svg: d3.Selection<any, {}, HTMLElement, any>;
  private mapPath: d3.ValueFn<any, any, any>;
  private mapTransform: { x: number, y: number, k: number };
  private isMapReady: boolean = false;
  private isZoomingNow: boolean = false;
  private zoom: d3.ZoomBehavior<any, any>;

  width: number;
  height: number;

  @Input('map-width') svgWidth: Function;
  @Input('map-height') svgHeight: Function;
  @Input('zoom-on-update') zoomOnUpdate: boolean;
  @Input('data-to-draw') dataToDraw: any[];
  @Input('chart-type') chartType: string; // circle || bar

  @Output('data-click') onDataClick = new EventEmitter();
  @Output('markers-rendered') onMarkersRendered = new EventEmitter();
  @Output('map-rendered') onMapRendered = new EventEmitter();

  constructor(private elRef: ElementRef) {
    this.mapTransform = { x: 0, y: 0, k: 1 };
    this.chartType = 'circle';
  }

  ngOnChanges(changes: any) {
    if (
      changes.svgWidth && changes.svgHeight &&
      typeof changes.svgWidth.currentValue === 'function' &&
      typeof changes.svgHeight.currentValue === 'function') {
      this.width = this.svgWidth();
      this.height = this.svgHeight();
      this.initMap();
      this.renderMap();
    }

    if (changes.dataToDraw) {
      this.renderMarkers();

      if (this.zoomOnUpdate) {
        this.zoomToMarkers();
      }
    }
  }

  initMap() {
    if (!this.isMapReady) {
      this.svg = d3.select('svg#map');

      this.projection = d3proj.geoPatterson()
        .scale((this.svgWidth() - 1) / 2 / Math.PI)
        .translate([this.svgWidth() / 2, this.svgHeight() / 2]);

      this.mapPath = d3.geoPath(this.projection);

      this.zoom = d3.zoom()
        .scaleExtent([1, 150])
        .on('zoom', () => {
          const { x, y, k } = d3.event.transform;
          this.mapTransform = d3.event.transform;
          const map = this.svg.select('g');
          map.attr('transform', `translate(${x}, ${y})scale(${k})`);
          this.renderMarkers(k);
        });

      this.svg.call(this.zoom);
      this.isMapReady = true;
    }
  }

  renderMap() {
    if (this.isMapReady) {
      this.svg.append('g')
        .attr('class', 'map')
        .selectAll('path')
        .data(topojson.feature(mapTopoJson, mapTopoJson.objects.countries).features)
        .enter()
        .append('path')
        .attr('d', this.mapPath);

      this.onMapRendered.emit();
    }
  }

  renderMarkers(scale?: number) {
    if (this.isMapReady) {
      const map = this.svg.select('g.map');
      const data = this.dataToDraw.filter((item) => {
        return Boolean(item.value);
      });
      const ranges = data.map((item) => {
        return parseInt(item.value);
      });
      // const getRadius = d3.scaleLinear()
      //   .domain([d3.min(ranges), d3.max(ranges)])
      //   .range([5, 25])
      //   .clamp(true);

      const radiusScale = d3.scaleLinear()
        .domain([d3.min(ranges), d3.max(ranges)])
        .range([5, 25])
        .clamp(true);

      const barScale = d3.scaleLinear()
        .domain(d3.extent(ranges))
        .range([10, this.svgHeight() / 20])
        .clamp(true);

      const path = d3.geoPath().projection(this.projection);

      scale = scale || this.mapTransform.k;

      const markers = map.selectAll('.marker')
        .data(data);

      markers.exit().remove();

      const { onDataClick } = this;
      if (this.chartType === 'bar') {
        markers
          .attr('transform', (d: any) => {
            const position = this.projection([d.longitude, d.latitude]);
            return `translate(${[
             position[0],
             position[1] - barScale(parseInt(d.value) | 1) / scale
            ]})`;
          })
          .attr('height', (d: any) => barScale(parseInt(d.value) | 1) / scale)
          .attr('width', 10 / scale);

        markers.enter()
          .append('rect')
          .attr('class', 'marker')
          .attr('transform', (d: any) => {
            return `translate(${this.projection([d.longitude, d.latitude])})`;
          })
          .attr('width', 10)
          .attr('height', (d: any) => barScale(parseInt(d.value) | 1) / scale)
          .on('mousedown', function (d: any) {
            onDataClick.emit({ data: d, element: this });
          });
      } else {
        markers.attr('transform', (d: any) => `translate(${this.projection([d.longitude, d.latitude])})`)
          .attr('r', (d: any) => radiusScale(parseInt(d.value) | 1) / scale);

        markers.enter()
          .append('circle')
          .attr('class', 'marker')
          .attr('transform', (d: any) => `translate(${this.projection([d.longitude, d.latitude])})`)
          .attr('r', (d: any) => radiusScale(parseInt(d.value) | 1) / scale)
          .on('mousedown', function (d: any) {
            onDataClick.emit({ data: d, element: this });
          });
      }

      this.onMarkersRendered.emit();
    }
  }

  zoomToMarkers() {
    if (!this.isZoomingNow && this.isMapReady) {
      this.isZoomingNow = true;
      const map = this.svg.select('g.map');
      const path = d3.geoPath().projection(this.projection);

      const markersData = map.selectAll('.marker').data();

      let x;
      let y;
      let k;

      if (markersData.length > 0) {
        const sitesLongs = markersData.map((item: any) => item.longitude);
        const sitesLats = markersData.map((item: any) => item.latitude);
        const minPoint = this.projection([Math.min(...sitesLongs), Math.min(...sitesLats)]);
        const maxPoint = this.projection([Math.max(...sitesLongs), Math.max(...sitesLats)]);

        const dx = maxPoint[0] - minPoint[0] || 1;
        const dy = maxPoint[1] - minPoint[1] || 1;
        x = (minPoint[0] + maxPoint[0]) / 2;
        y = (maxPoint[1] + minPoint[1]) / 2;
        k = Math.max(.2 / Math.max(dx / this.width, dy / this.height), 1);
      } else {
        x = this.width / 2;
        y = this.height / 2;
        k = 1;
      }

      map.transition()
        .duration(750)
        .attr('transform', `translate(${this.width / 2}, ${this.height / 2})` +
        `scale(${k})translate(${[-x, -y]})`)
        .on('end', () => {
          try {
            this.isZoomingNow = false;
            const regExp = /\((.+?), (.+?)\).+\((.+?),/g;
            const transform = map.attr('transform');
            if (transform) {
              const maches = regExp.exec(transform);
              this.mapTransform = { x: +maches[1], y: +maches[2], k: +maches[3] };
              const zoomIdentity = d3.zoomIdentity
                .translate(+maches[1], +maches[2])
                .scale(+maches[3]);
              this.svg.call(this.zoom.transform, zoomIdentity);
            }
          } catch (err) {
            if (err instanceof TypeError) return;
            throw err;
          }
        });

      this.renderMarkers(k);
    }
  }
}
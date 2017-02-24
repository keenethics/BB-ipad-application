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
import { Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';

import * as d3 from 'd3';
import * as d3proj from 'd3-geo-projection';
import * as topojson from 'topojson';

import * as mapTopoJson from './json/world.json';

import template from './world-map.component.html';
import styles from './world-map.component.scss';

import { BusinessDataUnit } from '../../../../both/data-management/business-data.collection';
import { DataProvider } from '../data-management';
import { MarketCountriesProvider } from './countries/market-countries';

@Component({
  selector: 'world-map',
  styles: [styles],
  encapsulation: ViewEncapsulation.None,
  providers: [DataProvider],
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
  @Input('show-labels') labels: boolean;
  @Input('show-values') values: boolean;
  @Input('zoom-scale-extend') zoomScaleExtend: [number, number];

  @Output('data-click') onDataClick = new EventEmitter();
  @Output('markers-rendered') onMarkersRendered = new EventEmitter();
  @Output('map-rendered') onMapRendered = new EventEmitter();
  @Output('select-country') onSelectCountry = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    private plt: Platform,
    private dataProvider: DataProvider,
    private marketCountries: MarketCountriesProvider
  ) {
    this.mapTransform = { x: 0, y: 0, k: 1 };
    this.zoomScaleExtend = [1, 30];
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

      if (this.dataToDraw) {
        this.renderMarkers();
      }
    }

    if (changes.dataToDraw) {
      this.renderMarkers();
      this.selectCountries(this.dataToDraw);

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
        .scaleExtent(this.zoomScaleExtend)
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
        .attr('data-country', (d: any) => d.properties.name_long)
        .attr('d', this.mapPath)
        .style('pointer-events', 'visible')
        .on('click', (d: any) => {
          const names = [
            d.properties['name'],
            d.properties['name_long'],
            d.properties['formal_en'],
            d.properties['admin']
          ].reduce((acc: string[], n: string) => {
            if (acc.indexOf(n) === -1) {
              acc.push(n);
            }
            return acc;
          }, []);

          this.onSelectCountry.emit(names);
        });
        // .on('mousedown', (d: any) => {
        //   let isClicked = true;
        //   setTimeout(() => { isClicked = false; }, 600);

        //   const names = [
        //     d.properties['name'],
        //     d.properties['name_long'],
        //     d.properties['formal_en'],
        //     d.properties['admin']
        //   ].reduce((acc: string[], n: string) => {
        //     if (acc.indexOf(n) === -1) {
        //       acc.push(n);
        //     }
        //     return acc;
        //   }, []);

        //   if (isClicked) this.onSelectCountry.emit(names);
        // });

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


      const path = d3.geoPath().projection(this.projection);

      scale = scale || this.mapTransform.k;

      const placeholders = map.selectAll('g.marker')
        .data(data);

      placeholders.exit().remove();

      if (this.chartType === 'bar') {
        this.renderBars(ranges, scale, placeholders);
      } else {
        this.renderCircles(ranges, scale, placeholders);
      }

      this.onMarkersRendered.emit();
    }
  }

  private renderBars(ranges: any[], scale: number, placeholders: any) {
    try {
      const barScale = d3.scaleLinear()
        .domain(d3.extent(ranges))
        .range([5, this.svgHeight() / 20])
        .clamp(true);

      const onDataClick = this.onDataClick;

      const groupEnter = placeholders.enter()
        .append('g')
        .attr('class', 'marker')
        .attr('style', 'cursor: pointer')
        .attr('transform', (d: any) => {
          return `translate(${this.projection([parseInt(d.longitude, 10) || 0, parseInt(d.latitude, 10) || 0])})`;
        })
        .on('mousedown', function (d: any) {
          onDataClick.emit({ data: d, element: this });
        });

      groupEnter.append('rect')
        .attr('class', 'bar')
        .attr('width', 10)
        .attr('height', (d: any) => barScale(parseInt(d.value) | 0) / scale)
        .attr('x', -5 / scale);

      if (this.labels || this.values) {
        groupEnter.append('rect')
          .attr('class', 'label-bg')
          .attr('fill', '#fff')
          .attr('rx', 4 / scale);

        groupEnter.append('text')
          .text((d: any) => this.getLabelText(d))
          .attr('class', 'label-text')
          .attr('stroke', 'none')
          .attr('font-size', 10)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            d.textSize = { width, height };
            return `translate(${[
              -(width / 2) / scale,
              -height / scale
            ]})`;
          });

        groupEnter.select('rect.label-bg')
          .attr('height', (d: any) => (d.textSize.height + 8) / scale)
          .attr('width', (d: any) => (d.textSize.width + 12) / scale)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            return `translate(${[
              -(width / 2) / scale,
              -(height + 4) / scale
            ]})`;
          });
      }

      const groupScale = placeholders
        .attr('transform', (d: any) => {
          const position = this.projection([parseInt(d.longitude, 10) || 0, parseInt(d.latitude, 10) || 0]);
          return `translate(${[
            position[0],
            position[1] - barScale(parseInt(d.value) | 0) / scale
          ]})`;
        });

      groupScale.select('rect.bar')
        .attr('height', (d: any) => barScale(parseInt(d.value) | 0) / scale)
        .attr('width', 10 / scale)
        .attr('x', -5 / scale);

      if (this.labels || this.values) {
        groupScale.select('text.label-text')
          .text((d: any) => this.getLabelText(d))
          .attr('font-size', 10 / scale)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            d.textSize = { width, height };
            return `translate(${[
              -(width / 2) / scale,
              -height / scale
            ]})`;
          });

        groupScale.select('rect.label-bg')
          .attr('height', (d: any) => (d.textSize.height + 8) / scale)
          .attr('width', (d: any) => (d.textSize.width + 12) / scale)
          .attr('rx', 4 / scale)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            return `translate(${[
              -(width / 2) / scale,
              -(height + 4) / scale
            ]})`;
          });
      }
    } catch (err) {
      console.log(err);
    }
  }

  private renderCircles(ranges: any[], scale: number, placeholders: any) {
    try {
      const radiusScale = d3.scaleLinear()
        .domain([d3.min(ranges), d3.max(ranges)])
        .range([5, 25])
        .clamp(true);

      const onDataClick = this.onDataClick;

      const groupEnter = placeholders.enter()
        .append('g')
        .attr('class', 'marker')
        .attr('style', 'cursor: pointer')
        .attr('transform', (d: any) => {
          return `translate(${this.projection([parseInt(d.longitude, 10) || 0, parseInt(d.latitude, 10) || 0])})`;
        })
        .on('mousedown', function (d: any) {
          onDataClick.emit({ data: d, element: this });
        });

      groupEnter.append('circle')
        .attr('r', (d: any) => radiusScale(parseInt(d.value) | 0) / scale);

      if (this.labels || this.values) {
        groupEnter.append('rect')
          .attr('fill', '#fff')
          .attr('rx', 4 / scale);

        groupEnter.append('text')
          .text((d: any) => this.getLabelText(d))
          .attr('class', 'label-text')
          .attr('stroke', 'none')
          .attr('font-size', 10)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            d.textSize = { width, height };
            return `translate(${[
              (-width / 2) / scale,
              -radiusScale(parseInt(d.value) | 0) / scale - height / scale
            ]})`;
          });

        groupEnter.select('rect')
          .attr('class', 'label-bg')
          .attr('height', (d: any) => (d.textSize.height + 8) / scale)
          .attr('width', (d: any) => (d.textSize.width + 12) / scale)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            return `translate(${[
              -width / 2 / scale,
              -(radiusScale(parseInt(d.value) | 0) + height + 4) / scale
            ]})`;
          });
      }

      const groupScale = placeholders
        .attr('transform', (d: any) => {
          const position = this.projection([parseInt(d.longitude, 10) || 0, parseInt(d.latitude, 10) || 0]);
          return `translate(${[
            position[0],
            position[1] - radiusScale(parseInt(d.value) | 0) / scale
          ]})`;
        });

      groupScale.select('circle')
        .attr('r', (d: any) => radiusScale(parseInt(d.value) | 0) / scale);

      if (this.labels || this.values) {
        groupScale.select('text.label-text')
          .text((d: any) => this.getLabelText(d))
          .attr('font-size', 10 / scale)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            d.textSize = { width, height };
            return `translate(${[
              (-width / 2) / scale,
              -radiusScale(parseInt(d.value) | 0) / scale - height / scale
            ]})`;
          });

        groupScale.select('rect.label-bg')
          .attr('height', (d: any) => (d.textSize.height + 8) / scale)
          .attr('width', (d: any) => (d.textSize.width + 12) / scale)
          .attr('rx', 4 / scale)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            return `translate(${[
              -width / 2 / scale,
              -(radiusScale(parseInt(d.value) | 0) + height + 4) / scale
            ]})`;
          });
      }
    } catch (err) {
      console.log(err);
    }
  }

  private getLabelText(dataUnit: BusinessDataUnit) {
    let text = '';
    if (dataUnit.city && dataUnit.city !== 'Total') {
      text = dataUnit.city;
    } else if (dataUnit.country && dataUnit.country !== 'Total') {
      text = dataUnit.country;
    } else if (dataUnit.market && dataUnit.market !== 'Total') {
      text = dataUnit.market;
    }

    if (this.values && this.labels) return `${text} ${text ? '•' : ''} ${dataUnit.value}`;

    if (this.labels) return text;

    if (this.values) return dataUnit.value;
  }

  zoomToMarkers() {
    if (!this.isZoomingNow && this.isMapReady) {
      this.isZoomingNow = true;
      const map = this.svg.select('g.map');
      const path = d3.geoPath().projection(this.projection);

      const markersData = map.selectAll('.marker').data();

      let x: number;
      let y: number;
      let k: number;

      if (markersData.length > 0) {
        const sitesLongs = markersData.map((item: any) => parseInt(item.longitude, 10) || 0);
        const sitesLats = markersData.map((item: any) => parseInt(item.latitude, 10) || 0);
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

      k = k > this.zoomScaleExtend[1] ? this.zoomScaleExtend[1] : k;

      const correctZoomIdentity = () => {
        try {
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
      };

      map.transition()
        .duration(750)
        .ease((t) => {
          correctZoomIdentity();
          return t;
        })
        .attr('transform', `translate(${this.width / 2}, ${this.height / 2})` +
        `scale(${k})translate(${[-x, -y]})`)
        .on('end', () => {
          correctZoomIdentity();
          this.isZoomingNow = false;
        });

      this.renderMarkers(k);
    }
  }

  selectCountries(data: any) {
    if (!this.svg) return;
    const countries = data.reduce((acc: string[], item: BusinessDataUnit) => {
      if (acc.indexOf(item.country) === -1) {
        acc.push(item.country);
      }
      return acc;
    }, []) as string[];

    const selectCountries = (countries: string[]) => {
      this.svg.select('g.map')
        .selectAll('path')
        .attr('class', (d: any) => {
          const names = [
            countries.indexOf(d.properties['name']),
            countries.indexOf(d.properties['name_long']),
            countries.indexOf(d.properties['formal_en']),
            countries.indexOf(d.properties['admin'])
          ];

          if (names[0] !== -1 || names[1] !== -1 || names[2] !== -1 || names[3] !== -1) {
            const index = names.filter(item => item !== -1)[0];
            countries.splice(index, 1);
            return 'selected';
          } else {
            return '';
          }
        });

      if (countries.length) {
        console.log(`%cWARNING! These countries not matched with the map data.`, 'background-color: yellow');
        console.log(countries);
      }
    };

    if (countries.indexOf('Total') !== -1) {
      const marketsNames = data.map((d: any) => d.market);
      this.marketCountries.getMarketsCoutries(marketsNames)
        .then((markets: any[]) => {
          const countries = markets.reduce((acc: any[], item: any) => [...acc, ...item.countries], []);
          selectCountries(countries);
        });
    } else {
      selectCountries(countries);
    }
  }
}

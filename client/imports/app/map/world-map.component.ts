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
import 'classlist-polyfill';

import * as d3 from 'd3';
import * as d3proj from 'd3-geo-projection';
import * as topojson from 'topojson';

import * as mapTopoJson from './json/world.json';

import template from './world-map.component.html';
import styles from './world-map.component.scss';

import { BusinessDataUnit } from '../../../../both/data-management/business-data.collection';
import { DataProvider } from '../data-management';
import { MarketCountriesProvider } from './countries/market-countries';
import { SepPipe } from '../common/pipes/comma-separator.pipe';


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
  private selectedMarkerElement: SVGCircleElement | SVGRectElement;
  private sepPipe: SepPipe;

  width: number;
  height: number;

  @Input('map-width') svgWidth: Function;
  @Input('map-height') svgHeight: Function;
  @Input('zoom-on-update') zoomOnUpdate: boolean;
  @Input('data-to-draw') dataToDraw: any[];
  @Input('chart-type') chartType: string; // circle || bar
  @Input('show-labels') labels: boolean;
  @Input('show-values') values: boolean;
  @Input('color') color: boolean;
  @Input('is-log-scale') isLogScale: boolean;
  @Input('zoom-scale-extend') zoomScaleExtend: [number, number];

  @Input('deselect-marker-emiter')
  set deselectMarkerEmiter(emiter: EventEmitter<any>) {
    emiter.subscribe(() => {
      this.removeSelectedMarkerClass();
    });
  }

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

    this.sepPipe = new SepPipe();
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
      setTimeout(() => this.selectCountries(this.dataToDraw), 0);
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
        .translateExtent([[0, 0], [this.svgWidth(), this.svgHeight()]])
        .on('zoom', () => {
          const { x, y, k } = d3.event.transform;
          this.mapTransform = d3.event.transform;
          const map = this.svg.select('g.map');
          map.attr('transform', `translate(${x}, ${y})scale(${k})`);
          map.selectAll('path').style('stroke-width', 1 / k);
          this.renderMarkers(k, true);
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

      this.onMapRendered.emit();
    }
  }

  renderMarkers(scale?: number, isZoom?: boolean) {
    if (this.isMapReady) {
      const map = this.svg.select('g.map');
      const data = this.dataToDraw.filter((item) => {
        return Boolean(item.periods.actual);
      });
      const ranges = data.map((item) => {
        return parseInt(item.periods.actual);
      });

      const path = d3.geoPath().projection(this.projection);

      scale = scale || this.mapTransform.k;

      if (!isZoom) {
        map.selectAll('g.marker').remove();
      }

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
      const scaleFunc = this.isLogScale ? d3.scaleLog : d3.scaleLinear;
      const barScale = scaleFunc()
        .domain(d3.extent(ranges))
        .range([5, this.svgHeight() / 20])
        .clamp(true);
      const mapContext = this;

      const groupEnter = placeholders.enter()
        .append('g')
        .attr('class', `marker${this.color ? ' red' : ''}`)
        .attr('style', 'cursor: pointer')
        .attr('transform', (d: any) => {
          const position = this.projection([parseFloat(d.longitude) || 0, parseFloat(d.latitude) || 0]);
          return `translate(${[
            position[0],
            position[1] - barScale(parseInt(d.periods.actual) | 0) / scale
          ]})scale(${1 / scale})`;
        })
        .on('click', function (d: any) {
          mapContext.selectedMarkerElement = this;
          mapContext.addSelectedMarkerClass(d);
          mapContext.onDataClick.emit({ data: d, element: this });
        });

      groupEnter.append('rect')
        .attr('class', 'bar')
        .attr('width', 10)
        .attr('height', (d: any) => barScale(parseInt(d.periods.actual) | 0))
        .attr('x', -5)
        .style('stroke-width', 1);

      if (this.labels || this.values) {
        groupEnter.append('rect')
          .attr('class', 'label-bg')
          .attr('fill', '#fff')
          .attr('rx', 4)
          .style('stroke-width', 1);

        groupEnter.append('text')
          .text((d: any) => this.getLabelText(d))
          .attr('class', 'label-text')
          .attr('stroke', 'none')
          .attr('font-size', 10)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            d.textSize = { width, height };
            return `translate(${[
              -(width / 2),
              (barScale(parseInt(d.periods.actual) | 0) + 15)
            ]})`;
          });

        groupEnter.select('rect.label-bg')
          .attr('height', (d: any) => (d.textSize.height + 6))
          .attr('width', (d: any) => (d.textSize.width + 12))
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            return `translate(${[
              -(width / 2),
              (barScale(parseInt(d.periods.actual) | 0) + 2)
            ]})`;
          });
      }

      const groupScale = placeholders
        .attr('transform', (d: any) => {
          const position = this.projection([parseFloat(d.longitude) || 0, parseFloat(d.latitude) || 0]);
          return `translate(${[
            position[0],
            position[1] - barScale(parseInt(d.periods.actual) | 0) / scale
          ]})scale(${1 / scale})`;
        });
    } catch (err) {
      console.log(err);
    }
  }

  private renderCircles(ranges: any[], scale: number, placeholders: any) {
    try {
      const scaleFunc = this.isLogScale ? d3.scaleLog : d3.scaleLinear;
      const radiusScale = scaleFunc()
        .domain([d3.min(ranges) - 1, d3.max(ranges)])
        .range([5, 25])
        .clamp(true);
      const mapContext = this;

      const groupEnter = placeholders.enter()
        .append('g')
        .attr('class', `marker${this.color ? ' red' : ''}`)
        .attr('style', 'cursor: pointer')
        .attr('transform', (d: any) => {
          const position = this.projection([parseFloat(d.longitude) || 0, parseFloat(d.latitude) || 0]);
          return `translate(${[
            position[0],
            position[1] - radiusScale(parseInt(d.periods.actual) | 0) / scale
          ]})scale(${1 / scale})`;
        })
        .on('click', function (d: any) {
          mapContext.selectedMarkerElement = this;
          mapContext.addSelectedMarkerClass(d);
          mapContext.onDataClick.emit({ data: d, element: this });
        });

      groupEnter.append('circle')
        .attr('r', (d: any) => radiusScale(parseInt(d.periods.actual) | 0))
        .style('stroke-width', 4);

      if (this.labels || this.values) {
        groupEnter.append('rect')
          .attr('fill', '#fff')
          .attr('rx', 4)
          .style('stroke-width', 1);

        groupEnter.append('text')
          .text((d: any) => this.getLabelText(d))
          .attr('class', 'label-text')
          .attr('stroke', 'none')
          .attr('font-size', 10)
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            d.textSize = { width, height };
            return `translate(${[
              (-width / 2),
              (radiusScale(parseInt(d.periods.actual) | 0) + 17)
            ]})`;
          });

        groupEnter.select('rect')
          .attr('class', 'label-bg')
          .attr('height', (d: any) => (d.textSize.height + 6))
          .attr('width', (d: any) => (d.textSize.width + 12))
          .attr('transform', function (d: any) {
            const { width, height } = this.getBoundingClientRect();
            return `translate(${[
              -width / 2,
              (radiusScale(parseInt(d.periods.actual) | 0) + 4)
            ]})`;
          });
      }

      const groupScale = placeholders
        .attr('transform', (d: any) => {
          const position = this.projection([parseFloat(d.longitude) || 0, parseFloat(d.latitude) || 0]);
          return `translate(${[
            position[0],
            position[1] - radiusScale(parseInt(d.periods.actual) | 0) / scale
          ]})scale(${1 / scale})`;
        });
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
    } else if (dataUnit.city === 'Total' && dataUnit.country === 'Total' && dataUnit.market === 'Total') {
      text = 'TOTAL';
    }

    if (this.values && this.labels) return `${text} ${text ? '•' : ''} ${this.sepPipe.transform(dataUnit.periods.actual.toString())}`;

    if (this.labels) return text;

    if (this.values) return this.sepPipe.transform(dataUnit.periods.actual.toString());
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

      if (markersData.length === 1) {
        this.isZoomingNow = false;
        return;
      }

      if (markersData.length > 0) {
        const sitesLongs = markersData.map((item: any) => parseFloat(item.longitude) || 0);
        const sitesLats = markersData.map((item: any) => parseFloat(item.latitude) || 0);
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
          const regExp = /\((.+?),? (.+?)\).+\((.+?)[,\)]/g;
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

      this.renderMarkers(k, true);
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

  private addSelectedMarkerClass(markerData: BusinessDataUnit) {
    let className: string;
    switch (markerData.identifier) {
      case 'City': className = 'selected-city'; break;
      case 'Country': className = 'selected-country'; break;
      case 'Market': className = 'selected-market'; break;
      default: className = 'selected-market';
    }

    this.selectedMarkerElement.classList.add(className);
  }

  private removeSelectedMarkerClass() {
    if (this.selectedMarkerElement) {
      this.selectedMarkerElement.classList.remove('selected-city', 'selected-country', 'selected-market');
    }
  }
}

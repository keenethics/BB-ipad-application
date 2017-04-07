import { Component, Input } from '@angular/core';
import { fabric } from 'fabric';

import * as d3 from 'd3';
import * as d3proj from 'd3-geo-projection';
import * as topojson from 'topojson';

import * as mapTopoJson from './json/world.json';

import template from './map.component.html';
import style from './map.component.scss';

@Component({
  selector: 'map',
  template,
  styles: [style]
})
export class MapComponent {
  private _width: number;
  private _height: number;
  private _projection: any;
  private _mapPath: any;

  @Input() mapWidth: any;
  @Input() mapHeight: any;

  constructor() {
    console.log(fabric);
  }

  ngAfterViewInit() {
    const canvas = new fabric.Canvas('map-canvas');

    this._projection = d3proj.geoPatterson()
      .scale((1500 - 1) / 2 / Math.PI)
      .translate([1500 / 2, 750 / 2]);

    this._mapPath = d3.geoPath(this._projection);

    fabric.Image.fromURL('https://pp.userapi.com/c836538/v836538214/2bbaa/2xInKlmetB4.jpg', (img: any) => {
      img.scaleToWidth(100);

      const circle = new fabric.Circle({
        radius: 1.5, fill: '#808EA8'
      });

      const patternSourceCanvas = new fabric.StaticCanvas();
      patternSourceCanvas.add(circle);

      const pattern = new fabric.Pattern({
        source: () => {
          patternSourceCanvas.setDimensions({
            width: 5,
            height: 5
          });
          return patternSourceCanvas.getElement();
        },
        repeat: 'repeat'
      });

      (topojson.feature(mapTopoJson, mapTopoJson.objects.countries).features as Array<any>).forEach((d) => {
        const pathString = this._mapPath(d);
        const path = new fabric.Path(pathString);

        path.set({ stroke: 1, fill: pattern });
        canvas.add(path);
      });

      canvas.on('mouse:over', (e: any) => {
        e.target.setFill('red');
        canvas.renderAll();
      });

      canvas.on('mouse:out', (e: any) => {
        e.target.setFill(pattern);
        canvas.renderAll();
      });
    });
  }
}

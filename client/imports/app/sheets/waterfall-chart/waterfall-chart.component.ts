import {
  Component,
  AfterViewInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';

import * as d3 from 'd3';

import template from './waterfall-chart.component.html';
import style from './waterfall-chart.component.scss';

@Component({
  selector: 'waterfall-chart',
  encapsulation: ViewEncapsulation.None,
  template,
  styles: [style],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaterfallChartComponent {
  @Input() data: any;
  @ViewChild('waterfallContainer') waterfallContainer: ElementRef;

  ngAfterViewInit() {
    // const data = [
    //   {"name":"P12 2016","value":"51513"},
    //   {"name":'RD','value':'-1810'},
    //   {'name':'RU','value':'504'},
    //   {'name':'Others(net)','value':'41'},
    //   {'name':'Delta to go','value':'1343'},
    //   {'name':'LP 2018','value':'50037'}
    //   ];
    // drawWaterflowChart(this.svg, data);
  }

  ngOnChanges(changes: any) {
    // [
    //   { "name": "P12 2016", "value": 51513, "start": 0, "end": 51513, "class": "initial" },
    //   { "name": "RD", "value": -1810, "start": 51513, "end": 49703, "class": "middle negative" },
    //   { "name": "RU", "value": 504, "start": 49703, "end": 50207, "class": "middle positive" },
    //   { "name": "Others(net)", "value": 41, "start": 50207, "end": 50248, "class": "middle positive" },
    //   { "name": "act P1 2017", "end": 50248, "start": 0, "class": "middle", "value": 50248 },
    //   { "name": "Delta to go", "value": 1343, "start": 50248, "end": 51591, "class": "result" },
    //   { "name": "LP 2017", "end": 51591, "start": 0, "class": "result final", "value": 51591 },
    //   { "name": "LP 2018", "value": 50037, "start": 0, "end": 50037, "class": "result final" }
    // ]
    if (changes.data.currentValue) {
      drawWaterflowChart(this.waterfallContainer.nativeElement, changes.data.currentValue);
    }
  }
}


function drawWaterflowChart(container: HTMLDivElement, data: any[]) {
  const chartw = 700;
  const charth = 400;
  const margin = { top: 50, right: 30, bottom: 30, left: 40 };
  const width = chartw - margin.left - margin.right;
  const height = charth - margin.top - margin.bottom;
  const padding = 0.3;
  // set the ranges
  const x = d3.scaleBand()
    .range([0, width])
    .padding(padding);
  const y = d3.scaleLinear()
    .range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const d3Container = d3.select(container);
  d3Container.select('svg').remove();
  const svg = d3Container.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
    'translate(' + margin.left + ',' + margin.top + ')');

  // format the data
  data.forEach(function (d) {
    d.value = +d.value;
  });

  // Transform data (i.e., finding cumulative values and total) for easier charting
  let cumulative = 0;
  for (let i = 0; i < 4/*data.length*/; i++) {
    data[i].start = cumulative;
    cumulative += data[i].value;
    data[i].end = cumulative;

    data[i].class = (data[i].value >= 0) ? 'middle positive' : 'middle negative';
  }

  // // data 0 - P12 2016
  data[0].class = 'initial';

  // // data 4 = act p1 2017
  data[4].class = 'middle';
  data[4].start = 0;
  data[4].end = data[4].value;

  // // data 5 = Delta to go
  data[5].class = 'result';
  data[5].start = data[4].end;
  data[5].end = data[5].start + data[5].value;

  // // data 6 = LP 2017
  data[6].class = 'result final';
  data[6].start = 0;
  data[6].end = data[6].value;

  // // data 7 = LP 2018
  data[7].class = 'result final';
  data[7].start = 0;
  data[7].end = data[7].value;

  // calculate whether it should be broken or not
  const minVal = Math.min(data[0].value - Math.abs(data[1].value), data[6].value, data[7].value);
  const maxVal = Math.max(Math.abs(data[1].value), data[2].value, data[3].value, data[5].value);
  let scaleStartVal = 0;
  if (minVal > maxVal) {
    scaleStartVal = minVal - maxVal;
    for (let i = 0; i < data.length; i++) {
      if (data[i].value > scaleStartVal) {
        data[i].start = scaleStartVal + 1;
      }
    }
  }

  // Scale the range of the data in the domains
  x.domain(data.map(function (d) { return d.name; }));
  y.domain([scaleStartVal, d3.max(data, function (d) { return d.value; })]);

  // append the rectangles for the bar chart
  const bar = svg.selectAll('.bar')
    .data(data)
    .enter().append('g')
    .attr('class', function (d) { return 'bar ' + d.class; })
    .attr('transform', function (d) { return 'translate(' + x(d.name) + ',0)'; });

  // draw bar
  bar.append('rect')
    .attr('y', function (d) { return y(Math.max(d.start, d.end)); })
    .attr('width', x.bandwidth())
    .attr('height', function (d) { return Math.abs(y(d.start) - y(d.end)); });

  // draw value
  bar.append('text')
    .attr('x', x.bandwidth() / 2)
    .attr('y', function (d) { return y(d.end) + 5; })
    .attr('dy', function (d) { return ((d.class.includes('negative')) ? '+' : '-') + '.75em'; })
    .text(function (d) { return commaFormatter(d.value/*d.end - d.start*/); });

  // draw connector
  bar.filter(function (d) { return d.class !== 'result final'; }).append('line')
    .attr('class', 'connector')
    .attr('x1', x.bandwidth() + 5)
    .attr('y1', function (d) { return y(d.end); })
    .attr('x2', x.bandwidth() / (1 - padding) - 5)
    .attr('y2', function (d) { return y(d.end); });

  // draw break
  bar.filter(function (d) { return (d.value > scaleStartVal); }).append('svg:image')
    .attr('xlink:href', function (d) { return ('/img/break2.svg'); })
    .attr('height', '33')
    .attr('width', '75')
    .attr('x', '-10')
    .attr('y', charth - 150);

  // add the x Axis
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // add the y Axis
  // svg.append("g")
  //     .call(d3.axisLeft(y));

  function commaFormatter(n: number) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

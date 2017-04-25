import {
  Component,
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

  ngOnChanges(changes: any) {
    if (changes.data.currentValue) {
      drawWaterflowChart(this.waterfallContainer.nativeElement, changes.data.currentValue);
    }
  }
}


function drawWaterflowChart(container: HTMLDivElement, data: any[]) {
  const chartw = 700;
  const charth = 300;
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

  if (minVal > 500 || maxVal > 500) {
    if (minVal > maxVal && minVal > maxVal * 5) {
      scaleStartVal = minVal - maxVal;
      for (let i = 0; i < data.length; i++) {
        if (data[i].value > scaleStartVal) {
          data[i].start = scaleStartVal + 1;
        }
      }
    } else if (data[0].value + data[1].value < 0) {
      scaleStartVal = data[0].value + data[1].value; // - y(10);
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
    .attr('y', function (d) { return ((d.value < 0) ? y(d.start) + 5 : y(d.end) + 5); })// { return y(d.end) + 5; })
    .attr('dy', function (d) { return '-.75em'; })
    .text(function (d) { return commaFormatter(d.value); });

  // draw connector
  bar.filter(function (d) { return d.class !== 'result final'; }).append('line')
    .attr('class', 'connector')
    .attr('x1', x.bandwidth() + 5)
    .attr('y1', function (d) { return y(d.end); })
    .attr('x2', x.bandwidth() / (1 - padding) - 5)
    .attr('y2', function (d) { return y(d.end); });

  // draw break
  bar.filter(function (d) { return (scaleStartVal > 0 && d.value >= scaleStartVal); }).append('svg:image')
    .attr('xlink:href', function (d) { return ('/img/break2.svg'); })
    .attr('height', '25')
    .attr('width', '73')
    .attr('x', '-10')
    .attr('y', charth - 120);


  // animation transition
  const t = d3.transition('animation-transition')
    .duration(1000)
    .ease(d3.easeLinear)
    .on('end', function (d) {
      svg.selectAll('line.connector').attr('style', 'display:block');
      svg.selectAll('.bar text').attr('style', 'display:block');
    });

  // draw animation veil
  bar.append('rect')
    .attr('class', 'bar veil')
    .attr('y', function (d) { return y(Math.max(d.start, d.end)) - 1; })
    .attr('x', -10)
    .attr('width', x.bandwidth() + 20)
    .attr('height', function (d) { return Math.abs(y(d.start) - y(d.end)); });

  // set animation
  svg.selectAll('.bar .veil').transition(t)
    .attr('height', function (d) { return 0; });

  // y 0 axe
  svg.append('g').append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(0))
    .attr('y2', y(0))
    .style('opacity', 0.5)
    .style('stroke-dasharray', 3)
    .style('stroke', '#000');

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

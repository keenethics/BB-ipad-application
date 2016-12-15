import { Component, AfterViewInit} from '@angular/core';

import template from './d3map.component.html';
import template_overlay from './d3map.overlay.component.html';
import style_overlay from './d3map.overlay.component.scss';
import style from './d3map.component.scss';
import { MeteorObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'd3map',
  template,
  styles: [ style ]
})
export class D3MapComponent implements AfterViewInit {
  private markets
  private width
  private height
  private active
  private projection
  private zoom
  private path
  private svg
  private tooltip
  private g
  private clicked
  private fsc

  constructor(){
    MeteorObservable.call('market_filter').subscribe((markets) => {
      this.markets = _.map(markets,function(market_name){return {'name':market_name,'checked':false}})
    }, (error) => {
      console.log(`Failed to receive market_filter due to ${error}`);
    });
    this.render_market()
    this.fsc = {}
  }

  render_page(){
    // hack fix to show angular2 data on page load.
    // Its empty, but it does the job
    // DO NOT DELETE the render_page!!
  }



  render_market() {setTimeout(() => {
    MeteorObservable.call('market_data').subscribe((map_markers) => {
      this.render_map(map_markers)
    }, (error) => {
      console.log(`Failed to receive map_markers due to ${error}`);
    });
  })}
  render_country() {setTimeout(() => {
    MeteorObservable.call('country_data').subscribe((map_markers) => {
      this.render_map(map_markers)
    }, (error) => {
      console.log(`Failed to receive map_markers due to ${error}`);
    });
  })}
  render_city() {setTimeout(() => {
    MeteorObservable.call('city_data').subscribe((map_markers) => {
      this.render_map(map_markers)
    }, (error) => {
      console.log(`Failed to receive map_markers due to ${error}`);
    });
  })}


  render_map(map_markers){
    d3.selectAll('.map_markers').remove()
    let projection = this.projection
    let svg = this.svg
    let tooltip = this.tooltip
    let clicked = this.clicked
    this.g.selectAll(".sites")
    .data(map_markers)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return projection([d.LNG, d.LAT])[0];
    })
    .attr("cy", function(d) {
      return projection([d.LNG, d.LAT])[1];
    })
    .attr("r", function(d) {

      let ranges =  map_markers.map(function(key) {return parseInt(key.HC);})
      let size = d3.scale.linear()
      .domain([d3.min(ranges),d3.mean(ranges),d3.max(ranges)])
      .range([2,6,10])
      .clamp(true);

      return size(d.HC)
    })
    .style("fill", function(d) {return "#124191"})
    .style("opacity", 0.8)
    .style("stroke-width", 0.5)
    .style("stroke", "FFF")
    .attr("class", function(d) {return "map_markers" +" " + d.City + " " + d.Country})
    .on("click", clicked)
  }

  ngAfterViewInit() {
    this.width = window.innerWidth - 150
    this.height = window.innerHeight
    this.active = d3.select(null)

    this.projection = d3.geo.patterson()
      .scale(100 + (window.innerWidth*40/800))
      .translate([this.width / 2, this.height / 2]);

    this.zoom = d3.behavior.zoom()
      .translate([0, 0])
      .scale(1)
      .scaleExtent([1, 15])
      .on("zoom", zoomed);

    this.path = d3.geo.path()
     .projection(this.projection);

    this.svg = d3.select("#map").append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      // .on("click", stopped, true); // for tooltip to work

    this.tooltip = d3.select("#map").append("div")
     .attr("class", "tooltip");

    this.svg.append("rect")
      .attr("class", "background")
      .attr("width", this.width)
      .attr("height", this.height)
      .on("click", reset);

    this.g = this.svg.append("g");

    //Enable Closures
    let g = this.g
    let projection = this.projection
    let path = this.path
    let active = this.active
    let svg = this.svg
    let tooltip = this.tooltip
    let zoom = this.zoom
    let width = this.width
    let height = this.height
    let fsc = this.fsc
    
    svg
      .call(zoom) // delete this line to disable free zooming
      .call(zoom.event);


    function clicked(d) {
      // if (active.node() === this) return reset();
      active = d3.select(this).classed("active", true);
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
      MeteorObservable.call('fact_sheet_c', d._id).subscribe((result) => {
        _.each(result, function(value, key){
          fsc[key] = value
        })
      }, (error) => {
        console.log(`Failed to receive fact sheet C data due to ${error}`);
      })

      MeteorObservable.call('overlay_data', d._id).subscribe((result) => {
        let template = (tpl, args) => tpl.replace(/{{(\w+)}}/g, (_, v) => args[v])
        let render_template = template(template_overlay, result)
        // console.log(mouse)
        //  posX i.e mouse[0] =  = window.innerWidth - overlaybox width - sidenav width - pad adj
        //  posY i.e mouse[1] = window.innerHeight - overlaybox height - pad adj
        let winWidth = window.innerWidth - 390 - 150
        let xAdj = 0
        if(mouse[1] > window.innerHeight - 220 - 50) {
          // console.log('h adj')
          mouse[1] = window.innerHeight - 220 - 50
          if(mouse[0] > (390 + 50)) {
            // console.log('h & w adj')
            mouse[0] = mouse[0] - 390 - 50
            xAdj = 50
          }
        }
        if(mouse[0] >  winWidth - 150){
          // console.log('w left adj')
          mouse[0] = winWidth - 50 - xAdj
        }
        tooltip
        .classed("hidden", false)
        .attr("style", "left:"+(mouse[0] + 10)+"px;top:"+ (mouse[1] + 10) +"px")
        .html('<style>' +  style_overlay + '</style>' + render_template)

      }, (error) => {
        console.log(`Failed to receive overlay data due to ${error}`);
      });

    }
    this.clicked = clicked

    function reset() {
      active.classed("active", false);
      active = d3.select(null);

      // svg.transition()
      //     .duration(1000)
      //     .call(zoom.translate([0, 0]).scale(1).event);
    }

    function zoomed() {
      g.style("stroke-width", 1.5 / d3.event.scale + "px");
      g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
      if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }

    d3.json("maps/world-110m.topojson", function(error, data) {
      if (error) throw error;

      g.selectAll("path")
        .data(topojson.feature(data, data.objects.countries).features)
        .enter().append("path")
        .attr("d", path)
        .attr("stroke", "#999")
        .attr("fill", "#EEE")

      // g.selectAll(".sites")
      //   .data(sites)
      //   .enter()
      //   .append("circle")
      //   .attr("cx", function(d) {
      //     return projection([d.LNG, d.LAT])[0];
      //   })
      //   .attr("cy", function(d) {
      //     return projection([d.LNG, d.LAT])[1];
      //   })
      //   .attr("r", function(d) {
      //     return Math.floor(Math.random() * 8) + 1
      //   })
      //   .style("fill", function(d) {
      //     var rnd = Math.floor(Math.random() * 4)
      //     var color = ["red", "green", "blue","yellow"]
      //     return color[rnd]
      //   })
      //   .attr("class", "feature")
      //   .on("click", clicked)
      //   .on("mousemove", function(d,i) {
      //     // debugger
      //     var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
      //     tooltip
      //       .classed("hidden", false)
      //       .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
      //       .html(d.Color)
      //   })
      //   .on("mouseout",  function(d,i) {
      //     tooltip.classed("hidden", true)
      //   })
    });
  }
}

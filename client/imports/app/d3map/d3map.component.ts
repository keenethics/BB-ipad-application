import { Component, AfterViewInit} from '@angular/core';

import template from './d3map.component.html';
import template_overlay from './overlay/d3map.overlay.component.html';
import style_overlay from './overlay/d3map.overlay.component.scss';
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
  private countries
  private cities
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
  private zoomed
  private adj_map_markers
  private scale_level = 1
  private acc // accordion
  private displayNav: boolean = false;


  /** Swipe START **/
  private triggerElementID = null; // this variable is used to identity the triggering element
  private fingerCount = 0;
  private startX = 0;
  private startY = 0;
  private curX = 0;
  private curY = 0;
  private deltaX = 0;
  private deltaY = 0;
  private horzDiff = 0;
  private vertDiff = 0;
  private minLength = 20; // the shortest distance the user may swipe
  private swipeLength = 0;
  private swipeAngle = null;
  private swipeDirection = null;

  // The 4 Touch Event Handlers

  // NOTE: the touchStart handler should also receive the ID of the triggering element
  // make sure its ID is passed in the event call placed in the element declaration, like:
  // <div id="picture-frame" ontouchstart="touchStart(event,'picture-frame');"  ontouchend="touchEnd(event);" ontouchmove="touchMove(event);" ontouchcancel="touchCancel(event);">

  touchStart(event,passedName) {
    // disable the standard ability to select the touched object
    // event.preventDefault();
    // get the total number of fingers touching the screen
    this.fingerCount = event.touches.length;
    // since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
    // check that only one finger was used
    if ( this.fingerCount == 1 ) {
      // get the coordinates of the touch
      this.startX = event.touches[0].pageX;
      this.startY = event.touches[0].pageY;
      // store the triggering element ID
      this.triggerElementID = passedName;
    } else {
      // more than one finger touched so cancel
      this.touchCancel(event);
    }
  }

  touchMove(event) {
    // event.preventDefault();
    if ( event.touches.length == 1 ) {
      this.curX = event.touches[0].pageX;
      this.curY = event.touches[0].pageY;
    } else {
      this.touchCancel(event);
    }
  }

  touchEnd(event) {
    // event.preventDefault();
    // check to see if more than one finger was used and that there is an ending coordinate
    if ( this.fingerCount == 1 && this.curX != 0 ) {
      // use the Distance Formula to determine the length of the swipe
      this.swipeLength = Math.round(Math.sqrt(Math.pow(this.curX - this.startX,2) + Math.pow(this.curY - this.startY,2)));
      // if the user swiped more than the minimum length, perform the appropriate action
      if ( this.swipeLength >= this.minLength ) {
        this.caluculateAngle();
        this.determineSwipeDirection();
        this.processingRoutine();
        this.touchCancel(event); // reset the variables
      } else {
        this.touchCancel(event);
      }   
    } else {
      this.touchCancel(event);
    }
  }

  touchCancel(event) {
    // reset the variables back to default values
    this.fingerCount = 0;
    this.startX = 0;
    this.startY = 0;
    this.curX = 0;
    this.curY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.horzDiff = 0;
    this.vertDiff = 0;
    this.swipeLength = 0;
    this.swipeAngle = null;
    this.swipeDirection = null;
    this.triggerElementID = null;
  }

  caluculateAngle() {
    var X = this.startX-this.curX;
    var Y = this.curY-this.startY;
    var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
    var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
    this.swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
    if ( this.swipeAngle < 0 ) { this.swipeAngle =  360 - Math.abs(this.swipeAngle); }
  }

  determineSwipeDirection() {
    if ( (this.swipeAngle <= 45) && (this.swipeAngle >= 0) ) {
      this.swipeDirection = 'left';
    } else if ( (this.swipeAngle <= 360) && (this.swipeAngle >= 315) ) {
      this.swipeDirection = 'left';
    } else if ( (this.swipeAngle >= 135) && (this.swipeAngle <= 225) ) {
      this.swipeDirection = 'right';
    } else if ( (this.swipeAngle > 45) && (this.swipeAngle < 135) ) {
      this.swipeDirection = 'down';
    } else {
      this.swipeDirection = 'up';
    }
  }

  processingRoutine() {
    var swipedElement = document.getElementById(this.triggerElementID);
    if ( this.swipeDirection == 'left' ) {
      this.displayNav = false         
    } else if ( this.swipeDirection == 'right' ) {
      this.displayNav = true
    } else if ( this.swipeDirection == 'up' ) {
    } else if ( this.swipeDirection == 'down' ) {
    }
  }
  /** Swipe END **/

  constructor(){
    MeteorObservable.call('market_filter').subscribe((markets) => {
      this.markets = _.map(markets,function(market_name){return {'name':market_name,'checked':false}})
    }, (error) => {
      console.log(`Failed to receive market_filter due to ${error}`);
    })
    MeteorObservable.call('country_filter').subscribe((countries) => {
      this.countries = _.map(countries,function(country_name){return {'name':country_name,'checked':false}})
    }, (error) => {
      console.log(`Failed to receive country_filter due to ${error}`);
    })
    MeteorObservable.call('city_filter').subscribe((cities) => {
      this.cities = _.map(cities,function(city_name){return {'name':city_name,'checked':false}})
    }, (error) => {
      console.log(`Failed to receive city_filter due to ${error}`);
    })
    this.render_market()
    this.fsc = {}
    this.acc = {'market' : false, 'country': false, 'city': false}
  }

  render_page(){
    // hack fix to show angular2 data on page load.
    // Its empty, but it does the job
    // DO NOT DELETE the render_page!!
  }



  acc_display(data){
    // this.acc = {'market' : false, 'country': false, 'city': false}
    this.acc[data] = !this.acc[data]
  }
  render_market(market) {setTimeout(() => {
    let market_name = market ? market.name : null
    if(!market_name) this.acc_display('market')
    MeteorObservable.call('market_data', market_name).subscribe((map_markers) => {
      this.render_map(map_markers)
    }, (error) => {
      console.log(`Failed to receive map_markers due to ${error}`);
    });
  })}
  render_country(country) {setTimeout(() => {    
    let country_name = country ? country.name : null
    if(!country_name) this.acc_display('country')
    MeteorObservable.call('country_data', country_name).subscribe((map_markers) => {
      this.render_map(map_markers)
    }, (error) => {
      console.log(`Failed to receive map_markers due to ${error}`);
    });
  })}
  render_city(city) {setTimeout(() => {
    let city_name = city ? city.name : null
    if(!city_name) this.acc_display('city')
    MeteorObservable.call('city_data', city_name).subscribe((map_markers) => {
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
    .style("fill", function(d) {return "#124191"})
    .style("opacity", 0.8)
    .style("stroke-width", 0.5)
    .style("stroke", "FFF")
    .attr("class", "map_markers") //function(d) {return "map_markers" +" " + d.City + " " + d.Country})
    .on("click", clicked)

    this.adj_map_markers()
  }

  ngAfterViewInit() {
    let zoomed = this.zoomed = function() {
      g.style("stroke-width", 1.5 / d3.event.scale + "px");
      g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      adj_map_markers()
    }

    let adj_map_markers = this.adj_map_markers = function(){
      if(d3.event && d3.event.scale) scale_level = d3.event.scale        
      let scale = scale_level
      // set the ranges
      let ranges =  d3.selectAll('circle.map_markers').data().map(function(key) {return parseInt(key.HC);})
      let size = d3.scale.linear()
        .domain([d3.min(ranges),d3.max(ranges)])
        .range([5,25])
        .clamp(true);

      d3.selectAll('circle.map_markers')
        .attr('r', function(d) {return size(d.HC) / scale; })
        .style("stroke-width", (1 / scale));
    }

    this.width = window.innerWidth
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
    let scale_level = this.scale_level
    
    svg
      .call(zoom) // delete this line to disable free zooming
      .call(zoom.event);


    let clicked = this.clicked = function(d) {
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
        let winWidth = window.innerWidth - 390
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

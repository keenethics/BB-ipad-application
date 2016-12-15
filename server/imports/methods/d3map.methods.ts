import { D3Maps } from '../../../both/collections/d3map.collection';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'underscore';

Meteor.methods({
  market_filter: function () {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    var D3MapsCol = D3Maps.collection
    var pipeline = [
      { $match : { Market : { $ne : "Total" } } },
      { $group : {_id : "agg", ma : { $addToSet : "$Market" } } },
      { $project: { ma: 1,'_id':0 }},
      { $unwind : "$ma" },
      { $sort : { ma : 1 } },
      { $group : {_id : "sort_agg", result : { $push : "$ma" } } }
    ];

    var result = D3MapsCol.aggregate(pipeline)
    // console.log(result[0])
    return result[0].result
  },

  map_markers: function (markets) {
    console.log(markets)
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    let find
    if(markets) {
      find = {
        'Market':{
          '$in': markets
        }
      }
    } else {
      find = {}
    }
    let options = {
      fields: {
        "LAT": 1,
        "LNG": 1,
        "City": 1,
        "HC":1
      },
      limit: 5000
    }
    let result = D3Maps.find(find, options).fetch();
    return result
  },

  market_data: function () {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    let find = {
      'N-2':'Total',
      'Identifier':'Market',
      'Period':'Actuals',
      'MovementType':'Landing point'
    }
    let options = {
      fields: {
        "LAT": 1,
        "LNG": 1,
        "HC" : 1
      },
      limit: 5000,
      sort: {HC: -1}
    }
    let result = D3Maps.find(find, options).fetch();
    return result
  },

  country_data: function () {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    let find = {
      'N-2':'Total',
      'Identifier':'Country',
      'Period':'Actuals',
      'MovementType':'Landing point'
    }
    let options = {
      fields: {
        "LAT": 1,
        "LNG": 1,
        "HC" : 1
      },
      limit: 5000,
      sort: {HC: -1}
    }
    let result = D3Maps.find(find, options).fetch();
    return result
  },

  city_data: function () {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    let find = {
      'N-2':'Total',
      'Identifier':'City',
      'Period':'Actuals',
      'MovementType':'Landing point'
    }
    let options = {
      fields: {
        "LAT": 1,
        "LNG": 1,
        "HC" : 1
      },
      limit: 5000,
      sort: {HC: -1}
    }
    let result = D3Maps.find(find, options).fetch();
    return result
  },

  overlay_data: function (d3map_id) {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    let d3map = D3Maps.findOne(d3map_id)
    let query = {
      'N-2':'Total',
    }

    let loc = {}
    if(d3map.Country == 'Total') { // means city is also total
      // get market data
      query['Market'] = d3map.Market 
      query['Identifier'] = 'Market'
      loc.location = d3map.Market
    } else {
      if(d3map.City == 'Total') {
        // get country data
        query['Country'] = d3map.Country
        query['Identifier'] = 'Country'
        loc.location = d3map.Country
      } else{
        // get city data
        query['Country'] = d3map.Country
        query['City'] = d3map.City
        query['Identifier'] = 'City'
        loc.location = d3map.City + ", "        
        loc.location += d3map.Country 
      }
    }

    let options = {
      fields: {
        "MovementType": 1,
        "Period": 1,
        "HC": 1
      },
      limit: 5000
    }

    let d3maps = D3Maps.find(query,options).fetch() 
    let resObj = {}
    _.each(d3maps, function(d3map){
      resObj[d3map.Period] = resObj[d3map.Period] || {}
      resObj[d3map.Period][d3map.MovementType] = d3map.HC
    });

    let key = 'Landing point'
    let r0 = {
      'r00': (() => {
        if(resObj['2016'] && resObj['2016'][key])
          return resObj['2016'][key]
        return 0
      })(),
      'r01': (() => {
        if(resObj['2017'] && resObj['2017'][key])
          return resObj['2017'][key]
        return 0
      })(),
      'r02': (() => {
        if(resObj['2018'] && resObj['2018'][key])
          return resObj['2018'][key]
        return 0
      })()
    }

    key = 'Ramp down'
    let r1 = {
      'r10': (() => {
        if(resObj['2017'] && resObj['2017'][key])
          return resObj['2017'][key]
        return 0
      })(),
      'r11': (() => {
        if(resObj['2018'] && resObj['2018'][key])
          return resObj['2018'][key]
        return 0
      })(),
      'r12': (() => {
        if(resObj['2019'] && resObj['2019'][key])
          return resObj['2019'][key]
        return 0
      })()
    }

    key = 'Ramp up'
    let r2 = {
      'r20': (() => {
        if(resObj['2017'] && resObj['2017'][key])
          return resObj['2017'][key]
        return 0
      })(),
      'r21': (() => {
        if(resObj['2018'] && resObj['2018'][key])
          return resObj['2018'][key]
        return 0
      })(),
      'r22': (() => {
        if(resObj['2019'] && resObj['2019'][key])
          return resObj['2019'][key]
        return 0
      })()
    }

    let key_1 = 'Transfer in'
    let key_2 = 'Transfer out'
    let r3 = {
      'r30': (() => {
        let sum = 0
        if(resObj['2017'] && resObj['2017'][key_1])
          sum += resObj['2017'][key_1]
        if(resObj['2017'] && resObj['2017'][key_2])
          sum += resObj['2017'][key_2]
        return sum
      })(),
      'r31': (() => {
        let sum = 0
        if(resObj['2018'] && resObj['2018'][key_1])
          sum += resObj['2018'][key_1]
        if(resObj['2018'] && resObj['2018'][key_2])
          sum += resObj['2018'][key_2]
        return sum
      })(),
      'r32': (() => {
        let sum = 0
        if(resObj['2019'] && resObj['2019'][key_1])
          sum += resObj['2019'][key_1]
        if(resObj['2019'] && resObj['2019'][key_2])
          sum += resObj['2019'][key_2]
        return sum
      })()
    }

    key_1 = 'Other in'
    key_2 = 'Other out'
    let r4 = {
      'r40': (() => {
        let sum = 0
        if(resObj['2017'] && resObj['2017'][key_1])
          sum += resObj['2017'][key_1]
        if(resObj['2017'] && resObj['2017'][key_2])
          sum += resObj['2017'][key_2]
        return sum
      })(),
      'r41': (() => {
        let sum = 0
        if(resObj['2018'] && resObj['2018'][key_1])
          sum += resObj['2018'][key_1]
        if(resObj['2018'] && resObj['2018'][key_2])
          sum += resObj['2018'][key_2]
        return sum
      })(),
      'r42': (() => {
        let sum = 0
        if(resObj['2019'] && resObj['2019'][key_1])
          sum += resObj['2019'][key_1]
        if(resObj['2019'] && resObj['2019'][key_2])
          sum += resObj['2019'][key_2]
        return sum
      })()
    }

    key = 'Landing point'
    let r5 = {
      'r50': (() => {
        if(resObj['2017'] && resObj['2017'][key])
          return resObj['2017'][key]
        return 0
      })(),
      'r51': (() => {
        if(resObj['2018'] && resObj['2018'][key])
          return resObj['2018'][key]
        return 0
      })(),
      'r52': (() => {
        if(resObj['2019'] && resObj['2019'][key])
          return resObj['2019'][key]
        return 0
      })()
    }
    resObj = _.extend(loc,r0,r1,r2,r3,r4,r5)
    return resObj
  },

  fact_sheet_c: function (d3map_id) {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    let d3map = D3Maps.findOne(d3map_id)
    let query = {
      'Period': {'$in': ['2016', '2019', 'Baseline']},
      'MovementType': 'Landing point'
    }

    let loc = {}
    if(d3map.Country == 'Total') { // means city is also total
      // get market data
      query['Market'] = d3map.Market 
      query['Identifier'] = 'Market'
      loc.location = d3map.Market
    } else {
      if(d3map.City == 'Total') {
        // get country data
        query['Country'] = d3map.Country
        query['Identifier'] = 'Country'
        loc.location = d3map.Country
      } else{
        // get city data
        query['Country'] = d3map.Country
        query['City'] = d3map.City
        query['Identifier'] = 'City'
        loc.location = d3map.City + ", "        
        loc.location += d3map.Country 
      }
    }

    let options = {
      fields: {
        'N-2': 1,
        "Period": 1,
        "HC": 1
      },
      limit: 5000
    }

    let d3maps = D3Maps.find(query,options).fetch() 
    let resObj = {}
    _.each(d3maps, function(d3map){
      resObj[d3map.Period] = resObj[d3map.Period] || {}
      resObj[d3map.Period][d3map['N-2']] = d3map.HC
    });

    let keys = [
      "Total",
      "MN Products-RN",
      "MN Products-CC",
      "Global Services",
      "Advanced MN Solutions",      
      "Product Portfolio Sales",      
      "Services Portfolio Sales",
      "COO",
      "Commercial Management",
      "CTO",
      "Business and Portfolio Integration Leadership",
      "Central Team"
    ]

    let obj = {}
    _.each(keys, function(key,index){

      obj["c_" + index + '_1'] = (() => {
        if(resObj['2016'] && resObj['2016'][key])
          return resObj['2016'][key]
        return '-'
      })()

      obj["c_" + index + '_3'] = (() => {
        if(resObj['2019'] && resObj['2019'][key])
          return resObj['2019'][key]
        return '-'
      })()

      obj["c_" + index + '_0'] = (() => {
        if(resObj['Baseline'] && resObj['Baseline'][key])
          return resObj['Baseline'][key]
        return '-'
      })()

      obj["c_" + index + '_2'] = (() => {
        let total = 0
        if(obj["c_" + index + '_3'] && obj["c_" + index + '_3'] != '-') 
          total += obj["c_" + index + '_3']
        if(obj["c_" + index + '_1'] && obj["c_" + index + '_1'] != '-') 
          total -= obj["c_" + index + '_1']
        return (total == 0) ? '-' : total
      })()

      obj["c_" + index + '_4'] = (() => {
        if((obj["c_" + index + '_2'] && obj["c_" + index + '_2'] != '-') &&
          (obj["c_" + index + '_1'] && obj["c_" + index + '_1'] != '-')) {
            let val = (obj["c_" + index + '_2'] / obj["c_" + index + '_1'])
            return val.toFixed(2) + '%'
          }
        return 'n.a.'
      })()
    })
    
    return obj
  }
})

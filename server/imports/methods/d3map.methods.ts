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
      {
        $match : {
          'N-2':'Total',
          'Identifier':'Market',
          'Period':'Actuals',
          'MovementType':'Landing point'
        } 
      },
      { $project: { Market: 1,'_id':0 }},
      { $sort : { Market : 1 } },
      { $group : {_id : "sort_agg", result : { $push : "$Market" } } }
    ];

    var result = D3MapsCol.aggregate(pipeline)
    return result[0].result
  },

  country_filter: function () {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    var D3MapsCol = D3Maps.collection
    var pipeline = [
      {
        $match : {
          'N-2':'Total',
          'Identifier':'Country',
          'Period':'Actuals',
          'MovementType':'Landing point'
        } 
      },
      { $project: { Country: 1,'_id':0 }},
      { $sort : { Country : 1 } },
      { $group : {_id : "sort_agg", result : { $push : "$Country" } } }
    ];

    var result = D3MapsCol.aggregate(pipeline)
    return result[0].result
  },

  city_filter: function () {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    var D3MapsCol = D3Maps.collection
    var pipeline = [
      {
        $match : {
          'N-2':'Total',
          'Identifier':'City',
          'Period':'Actuals',
          'MovementType':'Landing point'
        } 
      },
      { $project: { City: 1,'_id':0 }},
      { $sort : { City : 1 } },
      { $group : {_id : "sort_agg", result : { $push : "$City" } } }
    ];

    var result = D3MapsCol.aggregate(pipeline)
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

  market_data: function (market_name) {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    let find = {
      'N-2':'Total',
      'Identifier':'Country',
      'Period':'Actuals',
      'MovementType':'Landing point'
    }

    if(market_name) find.Market = market_name
    else find.Identifier = 'Market'

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

  country_data: function (country_name) {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    let find = {
      'N-2':'Total',
      'Identifier':'City',
      'Period':'Actuals',
      'MovementType':'Landing point'
    }
    if(country_name) find.Country = country_name
    else find.Identifier = 'Country'

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

  city_data: function (city_name) {
    let user = Meteor.user()
    if (!user)
      throw new Meteor.Error('403', 'No permissions!');

    let find = {
      'N-2':'Total',
      'Identifier':'City',
      'Period':'Actuals',
      'MovementType':'Landing point'
    }
    if(city_name) find.City = city_name
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
      "Others",
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
            return (val*100).toFixed(2) + '%'
          }
        return 'n.a.'
      })()

      obj["c_" + index + '_5'] = (() => {
        if("c_" + index + '_4' == 'n.a.') return 0
        let val = obj["c_" + index + '_4'].split('%')[0]
        if(parseFloat(val) <= -50) return 1
        if(parseFloat(val) <= -25) return 2
        if(parseFloat(val) <= -10) return 3
        else return 0
      })()

    }) // end loop
    
    // Others Adj
    obj["c_10_0"] = (() => {
      let total = 0
      if(obj["c_11_0"] != '-') total += obj["c_11_0"]
      if(obj["c_12_0"] != '-') total += obj["c_12_0"]
      return (total == 0) ? '-' : total
    })()

    obj["c_10_1"] = (() => {
      let total = 0
      if(obj["c_11_1"] != '-') total += obj["c_11_1"]
      if(obj["c_12_1"] != '-') total += obj["c_12_1"]
      return (total == 0) ? '-' : total
    })()
    obj["c_10_2"] = (() => {
      let total = 0
      if(obj["c_11_2"] != '-') total += obj["c_11_2"]
      if(obj["c_12_2"] != '-') total += obj["c_12_2"]
      return (total == 0) ? '-' : total
    })()
    obj["c_10_3"] = (() => {
      let total = 0
      if(obj["c_11_3"] != '-') total += obj["c_11_3"]
      if(obj["c_12_3"] != '-') total += obj["c_12_3"]
      return (total == 0) ? '-' : total
    })()
    obj["c_10_4"] = (() => {
      if((obj['c_10_2'] && obj['c_10_2'] != '-') &&
        (obj['c_10_1'] && obj['c_10_1'] != '-')) {
          let val = (obj['c_10_2'] / obj['c_10_1'])
          return (val*100).toFixed(2) + '%'
        }
      return 'n.a.'
    })()

    obj["c_10_5"] = (() => {
      if("c_10_4" == 'n.a.') return 0
      let val = obj["c_10_4"].split('%')[0]
      if(parseFloat(val) <= -50) return 1
      if(parseFloat(val) <= -25) return 2
      if(parseFloat(val) <= -10) return 3
      else return 0
    })()

    // delete unneccesary data
     _.each(["0","1","2","3","4","5"], function(key){
      delete obj['c_11_'+ key]
      delete obj['c_12_'+ key]
    })

    obj.location = loc.location
    return obj
  }
})

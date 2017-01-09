import { D3Maps } from '../../../both/collections/d3map.collection';
import { D3Map } from '../../../both/models/d3map.model';


export function loadD3Map() {
  // if (D3Maps.find().cursor.count() === 0) {
  //   let data = Assets.getText("sites.json")
  //   data = data
  //       // .replace(/'/g, '"') // doesnt work and breaks "Lao People's Democratic Republic" data (the comma after People)
  //       .replace(/{'/g, '{"')
  //       .replace(/':/g, '":')
  //       .replace(/:'/g, ':"')
  //       .replace(/',/g, '",')
  //       .replace(/'}/g, '"}')
  //       .replace(/,'/g, ',"')
  //       .replace(/n\/a/g, null) // replace n/a for the csv fields
  //       .replace(/,,,/g, ',') // replace triple commas for missing column informations
  //       .replace(/,,/g, ',') // replace double commas for missing column informations
  //   let d3maps = JSON.parse(data    );
  //   // console.log (data)
  //   d3maps.forEach((d3Map: D3Map) => D3Maps.insert(d3Map));
  // }
}
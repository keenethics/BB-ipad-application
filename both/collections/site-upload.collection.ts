import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { SiteUpload } from "../models/site-upload.model";
import { UploadFS } from 'meteor/jalik:ufs';
export const SiteUpload = new MongoObservable.Collection<SiteUpload>('site');
import { D3Maps } from './d3map.collection';
import { D3Map } from '../both/models/d3map.model';

function loggedIn(userId) {
  return !!Meteor.user()
}
 

export const SiteUploadStore = new UploadFS.store.Local({
  collection: SiteUpload.collection,
  name: 'sites',
  path: 'uploads',
  mode: '0744', // directory permissions
  writeMode: '0744', // file permissions
  // Apply a filter to restrict file upload
  filter: new UploadFS.Filter({
      onCheck: function(file) {
          if (file.extension !== 'json') {
              return false;
          }
          return true;
      }
  }),
  // Called when file has been uploaded
  onFinishUpload: function (file) {
      console.log(file.name + ' has been uploaded');
      var fs = require("fs");
      var filename = SiteUploadStore.getFilePath(file._id)
      var data = fs.readFileSync(filename, "utf8");
      data = data
        // .replace(/'/g, '"') // doesnt work and breaks "Lao People's Democratic Republic" data (the comma after People)
        .replace(/{'/g, '{"')
        .replace(/':/g, '":')
        .replace(/:'/g, ':"')
        .replace(/',/g, '",')
        .replace(/'}/g, '"}')
        .replace(/,'/g, ',"')
        .replace(/n\/a/g, null) // replace n/a for the csv fields
        .replace(/,,,/g, ',') // replace triple commas for missing column informations
        .replace(/,,/g, ',') // replace double commas for missing column informations
    let d3maps = JSON.parse(data);
    D3Maps.remove({})
    // console.log (data)
    d3maps.forEach((d3Map: D3Map) => D3Maps.insert(d3Map));
  },
      // Called when a copy error happened
    onCopyError: function (err, fileId, file) {
        console.error('Cannot create copy ' + file.name);
    },
    // Called when a read error happened
    onReadError: function (err, fileId, file) {
        console.error('Cannot read ' + file.name);
    },
    // Called when a write error happened
    onWriteError: function (err, fileId, file) {
        console.error('Cannot write ' + file.name);
    },
  permissions: new UploadFS.StorePermissions({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  })
})
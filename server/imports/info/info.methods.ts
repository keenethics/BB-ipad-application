import { Meteor } from 'meteor/meteor';
import * as fs from 'fs';

declare const process: any;

Meteor.methods({
  'info.version'() {
    const fileName = `${process.env.PWD}/package.json`;
    const file = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    const v = file && file.version;
    return v;
  }
});


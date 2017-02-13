import { Mongo } from 'meteor/mongo';
declare module 'meteor/meteor' {
  module Meteor {
    var connection: StatusConnection;
    var roles: Mongo.Collection<Role>;
  }

  interface StatusConnection {
    status: Function;
    userId: Function;
    _userId: string;
  }

  interface Role {
    _id: string;
    name: string
  }
}
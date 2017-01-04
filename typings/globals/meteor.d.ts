declare module 'meteor/meteor' {
  module Meteor {
    var connection: StatusConnection;
  }

  interface StatusConnection {
    status: Function;
    userId: Function;
    _userId: string;
  }
}
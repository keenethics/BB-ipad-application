interface IGround {
  Collection(params: any): Mongo.Collection<any>;
}

declare const Ground: IGround;
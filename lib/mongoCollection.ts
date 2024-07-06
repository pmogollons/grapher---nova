import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { addLinks, addSchema, addReducers, IReducerOption, ILinkCollectionOptions } from "@bluelibs/nova";


// @ts-expect-error - We are extending the Mongo.Collection class
export class MongoCollection extends Mongo.Collection {
  constructor(props: any) {
    super(props);

    // for @bluelibs/nova, we need to have only one instance of raw collection and use it everywhere
    if (Meteor.isServer) {
      // @ts-expect-error - We are extending the Mongo.Collection class
      this.raw = this.rawCollection();
      // @ts-expect-error - We are extending the Mongo.Collection class
      this.addReducers = addReducersFunction;
      // @ts-expect-error - We are extending the Mongo.Collection class
      this.addLinks = addLinksFunction;
      // @ts-expect-error - We are extending the Mongo.Collection class
      this.addSchema = addSchemaFunction;
    }
  }
}

/**
 * A wrapper for Nova addReducers function to use Meteor collections directly
 * @param reducers
 */

type Reducers = {
  [key: string]: IReducerOption;
};

export const addReducersFunction = function (reducers: Reducers) {
  // test if reducers are Async to help migrating previously written code
  const reducerKeys = Object.keys(reducers);

  reducerKeys.forEach((reducerKey) => {
    const reducer = reducers[reducerKey];

    if (!(reducer.reduce?.({}) instanceof Promise)) {
      console.warn(
        `The reduce function of the reducer ${reducerKey} must be an async function`,
        reducer.reduce?.constructor.name
      );
    }
  });

  return addReducers(this.raw, reducers);
};

/**
 * A wrapper for Nova addLinks function to use Meteor collections directly
 * @param links {Object} - links object
 */

type Links = {
  [key: string]: ILinkCollectionOptions;
};

export const addLinksFunction = function (links: Links) {
  // the collection key must be updated
  const newLinks: Links = {};

  Object.keys(links).forEach((linkKey) => {
    const link = links[linkKey];

    newLinks[linkKey] = {
      collection: () => link.collection.raw,
      field: link.field,
      foreignField: link.foreignField,
      unique: link.unique,
      many: link.many,
      inversedBy: link.inversedBy,
      index: link.index,
      filters: link.filters,
    };
  });

  return addLinks(this.raw, newLinks);
};

export const addSchemaFunction = function (schema: any) {
  return addSchema(this.raw, schema);
}

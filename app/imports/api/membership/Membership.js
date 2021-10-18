import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/**
 * The MembershipsCollection. It encapsulates state and variable values for membership.
 */
class MembershipsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'MembershipsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      userID: String,
      groupID: String,
    }, { tracker: Tracker });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
  }
}

/**
 * The singleton instance of the MembershipsCollection.
 * @type {MembershipsCollection}
 */
export const Memberships = new MembershipsCollection();

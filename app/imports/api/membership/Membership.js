import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/**
 * The MembershipCollection. It encapsulates state and variable values for Memberships.
 */
class MembershipCollection {
  constructor() {
    // The name of this collection.
    this.name = 'MembershipCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      userID: Number,
      groupID: Number,
    }, { tracker: Tracker });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
  }
}

/**
 * The singleton instance of the MembershipCollection.
 * @type {MembershipCollection}
 */
export const Memberships = new MembershipCollection();

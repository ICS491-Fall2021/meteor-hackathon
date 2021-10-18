import { check } from 'meteor/check';
import { Memberships } from './membership/Membership';

Meteor.methods({
    'memberships.insert'(userId, groupId) {
        check(groupId, String);
        check(userId, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        try {
            Memberships.collection.insert({
                userID: this.userId,
                groupID: groupId,
            })
            console.log("inserted!");
        } catch (error) {
            console.log("something went wrong with the error: " + error);
        }
    },
});


/* const subscription = Meteor.subscribe(Stuffs.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents
  const stuffs = Stuffs.collection.find({}).fetch(); */
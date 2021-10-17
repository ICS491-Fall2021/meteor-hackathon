import { check } from 'meteor/check';
import { Availabilities } from './availability/Availability';

Meteor.methods({
    'availabilities.insert'(owner, newestAvails) {
      check(newestAvails, Array);
      check(owner, String);
   
      if (!this.userId) {
        throw new Meteor.Error('Not authorized.');
      }
   
      console.log(newestAvails[0]);
      console.log(owner);

      try {Availabilities.collection.insert({
        owner: this.userId,
        timeSlots: newestAvails,
      })
        console.log("inserted!");
        } catch (error) {
          console.log("something went wrong with the error: " + error);
      }
    },
  });
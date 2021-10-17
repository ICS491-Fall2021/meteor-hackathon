import { check } from 'meteor/check';
import { Availabilities } from './availability/Availability';

Meteor.methods({
    'availabilities.insert'(owner, newestAvails) {
        check(newestAvails, Array);
        check(owner, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        // Delete any prior schedules because we need to overwrite it
        pastAvailabilities = Availabilities.collection.find({ owner: this.userId }).fetch();
        console.log("type of pastAvailabilities is: " + typeof(pastAvailabilities));
        console.log("pastAvailabilities is: " + pastAvailabilities);
        console.log("pastAvailabilities.length is: " + pastAvailabilities.length);
        if (pastAvailabilities.length > 0) {
            console.log("A past one existed");
            if (pastAvailabilities.length > 2) {
                pastAvailabilities.forEach(element => {
                    Availabilities.collection.remove(element);
                });
            }
            Availabilities.collection.remove(pastAvailabilities[0]);
        }

        console.log(newestAvails[0]);
        console.log(owner);

        try {
            Availabilities.collection.insert({
                owner: this.userId,
                timeSlots: newestAvails,
            })
            console.log("inserted!");
            console.log("------");
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
import { check } from 'meteor/check';
import { Availabilities } from './availability/Availability';
import { Memberships } from './membership/Membership';
import { Groups } from './group/Group';


Meteor.methods({
    'availabilities.insert'(owner, newestAvails) {
        check(newestAvails, Array);
        check(owner, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        // Delete any prior schedules because we need to overwrite it
        let pastAvailabilities = Availabilities.collection.find({ owner: this.userId }).fetch();
        if (pastAvailabilities.length > 0) {
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
        } catch (error) {
            console.log("something went wrong with the error: " + error);
        }
    },

    'availabilities.getCounts'(theGroupid) {
        console.log("in getCounts");
        check(theGroupid, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        // Find all members of the group using the memberships table
        let members = Memberships.collection.find({ groupID: theGroupid }).fetch();
        console.log(members);
        //members.push({_id: 'aTtKce8kdbxYRQRqb', userID: 'kPtyujGvBW8ftdff3', groupID: 'qLv8PqH4PWdYpuTrL'}) // test member
        // console.log(members[0]);
        // console.log(members[1]);

        // Combine all of the members' availabilities into an array
        let allMemberAvails = [];
        for (let index = 0; index < members.length; index++) {
            let oneMember = Availabilities.collection.findOne({ owner: members[index].userID });
            if (oneMember !== undefined) {
                console.log("Has availabilities")
                console.log("oneMember.timeSlots: " + oneMember.timeSlots);
                allMemberAvails = allMemberAvails.concat(oneMember.timeSlots);
            } else {
                console.log("didn't give availabilities");
            }
        }

        /* console.log(allMemberAvails.length);

        // Adding test availabilities to concat in:
        allMemberAvails = allMemberAvails.concat([allMemberAvails[0], allMemberAvails[9]]);

        console.log(allMemberAvails.length); // should be 2 more than the one above */

        const counts = {};
        allMemberAvails.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
        console.log("countts" + JSON.stringify(counts));

        return counts;
    },
});


/* const subscription = Meteor.subscribe(Stuffs.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents
  const stuffs = Stuffs.collection.find({}).fetch(); */
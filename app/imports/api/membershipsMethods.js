import { check } from 'meteor/check';
import { Memberships } from './membership/Membership';
import { Availabilities } from './availability/Availability';

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

    'memberships.findPossibleAttendees'(theTimeSlot, theGroupID) {
        console.log("In findPossibleAttendees");
        check(theTimeSlot, Date);
        check(theGroupID, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        let testing = false;
        
        // Manually adding another member to this group
        // Memberships.collection.insert({ userID : 'manmade2', groupID : theGroupID})

        // Find all members in this group
        let members = Memberships.collection.find({ groupID: theGroupID }).fetch();
        // console.log("members is: " + members);
        console.log("members stringified: " + JSON.stringify(members));
        //console.log("inside membeers: " + members[0].userID);
        
        let ids = [];
        let names = [];
        // For each member in this group, find the ones who have an availability of the given time slot
        for (let index = 0; index < members.length; index++) {
            let memberInfo = Availabilities.collection.findOne({ owner : members[index].userID});
            if (memberInfo !== undefined) {
                theTimeSlot = memberInfo.timeSlots[0];
            }
            if (memberInfo !== undefined && memberInfo.timeSlots.includes(theTimeSlot)) {
                console.log("member has an availability and matches theTimeSlot");
                ids = ids.concat(memberInfo.owner);
                names = names.concat(memberInfo.ownername);
            }
        }
        console.log("ids: " + JSON.stringify(ids));
        console.log("names: " + JSON.stringify(names));

        // Returns two arrays
        return {names, ids};
    },
});


/* const subscription = Meteor.subscribe(Stuffs.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents
  const stuffs = Stuffs.collection.find({}).fetch(); */
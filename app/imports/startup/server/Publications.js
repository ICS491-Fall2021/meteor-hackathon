import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff';
import { Groups } from '../../api/group/Group';
import { Memberships } from '../../api/membership/Membership';
import { Availabilities } from '../../api/availability/Availability';
import { Interests } from '../../api/interests/Interests';
import { Hangouts } from '../../api/hangout/Hangout';
import { Attendees } from '../../api/attendee/Attendee';


// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise publish nothing.
Meteor.publish(Stuffs.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Stuffs.collection.find({ owner: username });
  }
  return this.ready();
});

Meteor.publish(Hangouts.userPublicationName, function () {
  if (this.groupID) {
    return Hangouts.collection.find();
    // return Groups.collection.find({
    //    "_id": { "$in": [Memberships.collection.find({ owner: this.userId })[1]]} 
    //   });
  }
  return this.ready();
});

Meteor.publish(Attendees.userPublicationName, function () {
  if (this.userId) {
    return Attendees.collection.find();
    // return Groups.collection.find({
    //    "_id": { "$in": [Memberships.collection.find({ owner: this.userId })[1]]}
    //   });
  }
  return this.ready();
});

Meteor.publish(Availabilities.userPublicationName, function () {
  if (this.userId) {
    console.log("\npublish availabiltiies");
      // array of membership objects this user is in
      let groupsIn = Memberships.collection.find({ userID : this.userId }).fetch();
      let allGroupIDs = []
      // For each group this user is in, get the groupID
      groupsIn.forEach(group => {
        allGroupIDs = allGroupIDs.concat(group.groupID);
      });

      // Get all of the users that this user is in the same group in for ALL of the user's groups
      let groupmates = Memberships.collection.find({ "groupID": { "$in": allGroupIDs } }).fetch();
      console.log(JSON.stringify(groupmates));

      let result = [];
      groupmates.forEach(member => {
        if (!result.includes(member.userID)){
          result.push(member.userID);
        }
      });
      // get rid of duplicates
      // groupmates = _.uniq(groupmates);
      console.log(result);
    return Availabilities.collection.find({ "owner": { "$in": result } });
  }
  return this.ready();
});

Meteor.publish(Interests.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Interests.collection.find({ owner: username });
  }
  return this.ready();
});

Meteor.publish(Memberships.userPublicationName, function () {
    if (this.userId) {      
      console.log("\npublish memberships");
      // array of membership objects this user is in
      let groupsIn = Memberships.collection.find({ userID : this.userId }).fetch();
      let allGroupIDs = []
      // For each group this user is in, get the groupID
      groupsIn.forEach(group => {
        allGroupIDs = allGroupIDs.concat(group.groupID);
      });
        return Memberships.collection.find({ "groupID": { "$in": allGroupIDs } });
    }
    return this.ready();
  });

Meteor.publish(Groups.userPublicationName, function () {
  if (this.userId) {
    return Groups.collection.find();
    // return Groups.collection.find({
    //    "_id": { "$in": [Memberships.collection.find({ owner: this.userId })[1]]} 
    //   });
  }
  return this.ready();
});

// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise publish nothing.
Meteor.publish(Stuffs.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Stuffs.collection.find();
  }
  return this.ready();
});

// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise publish nothing.
Meteor.publish(Groups.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Groups.collection.find();
  }
  return this.ready();
});

// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise publish nothing.
Meteor.publish(Memberships.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Memberships.collection.find();
  }
  return this.ready();
});

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});

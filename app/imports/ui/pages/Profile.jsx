import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid, Loader, Segment, Button, Form, Icon, Header, Menu, Image, List } from 'semantic-ui-react';
import ScheduleSelector from 'react-schedule-selector'
import PropTypes from 'prop-types';
import { withRouter, NavLink, Link } from 'react-router-dom';
import { AutoForm, ErrorsField, TextField, SubmitField } from 'uniforms-semantic';
import { Roles } from 'meteor/alanning:roles';
import { Memberships } from '../../api/membership/Membership';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Groups } from '../../api/group/Group';
import { withTracker } from 'meteor/react-meteor-data';
import { Availabilities } from '../../api/availability/Availability';
import { Interests } from '../../api/interests/Interests';
import { Attendees } from '../../api/attendee/Attendee';
import { Hangouts } from '../../api/hangout/Hangout';


import InterestItem from '../components/InterestItem';
import MembershipsItem from '../components/MembershipsItem';
import JoinGroup from '../components/JoinGroup';
import CreateGroup from '../components/CreateGroup';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  interests: {
    type: String,
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

class Profile extends React.Component {
  constructor(props) {
    console.log("--In constructor--");
      super(props);
      this.closeModal.bind(this);
      this.state =  {
        location: '',
        user: this.props.currentUser,
        openCreate: false,
        openJoin: false,
      };
    }

    closeModal = () => {
      this.setState({ 
        openJoin: false, 
        openCreate: false
      });
    }

    updateLocation = (data) => {
      window.location.reload(false);
      console.log("DAWDWA" + JSON.stringify(data));
      this.setState({ location: data })
    }

   objectReformat(inputArray) {
      console.log("--In objectReformat--");
      // declare resulting array
      let result = [];
      
      // access "timeSlots" of this.props.availabilities
      let timeSlotObject = inputArray[0];
      // find length of timeSlots array
      let timeSlotArray = timeSlotObject[Object.keys(timeSlotObject)[3]];
      // iterate through timeSlots
      for (var i = 0; i < timeSlotArray.length; i++) {
        // push each entry to resulting array
        result.push(timeSlotArray[i]); 
      }
      return result;
    }   
  
    submit(data, formRef) {
      const { interests } = data;
      const owner = Meteor.user().username;
      Interests.collection.insert({ interests, owner },
        console.log(interests),
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item added successfully', 'success');
            formRef.reset();
          }
        });
    }



  handleChange = newSchedule => {
    this.setState({ schedule: newSchedule }, function () {
        console.log(this.state.schedule);
    });
    console.log("hi there was a change");
    let newAvails = this.state.schedule.toString().split(",");
    let user = Meteor.user()._id;
    let username = Meteor.user().username;
    // Meteor.call('availabilities.insert', user, username, newAvails);
  }

   // If the subscription(s) have been received, render the page, otherwise show a loading icon.
   render() {
    console.log("--In render?--");
    return (this.props.ready && this.props.interestsReady && this.props.membershipsReady && this.props.attendeesReady && this.props.hangoutsReady) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    let fRef = null;
    console.log("--In renderPage--");
    if (this.props.availabilities.length > 0) {
      this.state.schedule = this.objectReformat(this.props.availabilities);
    }
    console.log("function testing");
    findHangoutsParticipatedIn(this.userid);
    findAttendees("7DyQQDDWFJeeWc7z3");
    findContactedPeople(this.userid);
    return (
      <div className='wrapping'> 
        {/*https://stackoverflow.com/questions/63818088/add-text-over-image-from-semantic-ui  If somehow we could play the name over the image*/}
          <Grid.Column className="profile-wrapper" centered style={{ position: "relative", display: "flex"}}>
            <Image className='watermark' centered size='medium' src="/images/background.png"/>
            <Header as='h1'  className="title" centered>{this.props.currentUser}</Header>
          </Grid.Column>
  
        {/* <Grid columns={2} relaxed className="content">
          <Grid.Row>
            <Grid.Column className="box">
              <Image size='tiny' circular src="/images/Logo2transparent.png" centered style={{ float: 'right' }} />
            </Grid.Column>
            <Grid.Column className="box">
              <Header as='h1'  className="title" centered style={{ float: 'left'}}>{this.props.currentUser}</Header>
            </Grid.Column>
          </Grid.Row>
        </Grid> */}
        <Grid columns={2} relaxed padded className="content">
            <Grid.Row stretched>
                <Grid.Column className="box" width={12}>
                  <ScheduleSelector
                      selection={this.state.schedule}
                      numDays={7}
                      minTime={8}
                      dateFormat='ddd'
                      timeFormat='h:mm a'
                      maxTime={22}
                      hourlyChunks={1}
                      selectedColor={'#78bbe7'}
                      hoveredColor={'#9ce8f1'}
                      onChange={this.handleChange}
                      selection={this.state.schedule}
                  />
                  <Menu.Item as={NavLink} activeClassName="active" exact to="/availability" key='availability'>
                            <Button>Redo your availabilities!</Button>
                        </Menu.Item>
                </Grid.Column>
                <Grid.Column className="box-color" width={3}>
                <Button className='signout' floated='right' as={NavLink} exact to="/signout" icon color='blue' labelPosition='right'>
      Logout
      <Icon color='white' name='close icon' />
       </Button>
                    <Header as='h2'>Groups</Header>
                    <Button className="group-spacing" onClick={() => this.setState({openCreate: true})}>
                      Create Group
                    </Button>
                    <CreateGroup updateLocation={this.updateLocation} open={this.state.openCreate} closeModal={this.closeModal}/>
                    <JoinGroup updateLocation={this.updateLocation} open={this.state.openJoin} closeModal={this.closeModal}/>
                    <Button onClick={() => this.setState({openJoin: true})}>
                          Join Group
                    </Button>
                    <Header as='h2'>Groups Joined</Header>
                    <List>
                      {this.props.memberships.map((membership) => <MembershipsItem key={membership._id} membership={membership} />)}
                    </List>
                    <Header as='h2'>Contacted</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
                <Grid.Column className="box-color" width={12}>
                  <Header as='h2'>Interests</Header>
                    <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
                <Segment>
                  <TextField name='interests' />
                  <SubmitField value='Submit' />
                  <ErrorsField />
                </Segment>
              </AutoForm>
                </Grid.Column>
                <Grid.Column className="box-color" width={3}>
                <Header as='h2'>My Interests</Header>
                {this.props.interests.map((interest) => <InterestItem key={interest._id} interest={interest} />)}
                </Grid.Column>
            </Grid.Row>
        </Grid>
      </div>
    )
  }
}

Meteor.subscribe(Memberships.userPublicationName);
Meteor.subscribe(Groups.userPublicationName);


Profile.propTypes = {
  currentUser: PropTypes.string,
  availabilities: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
  memberships: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  interestsReady: PropTypes.bool.isRequired,
  membershipsReady: PropTypes.bool.isRequired,
  attendeesReady: PropTypes.bool.isRequired,
  attendees: PropTypes.array.isRequired,
  hangoutsReady: PropTypes.bool.isRequired,
  hangouts: PropTypes.array.isRequired,
};

 const ProfileContainer = withTracker(() => {
   console.log("--In withtracker--");
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Availabilities.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Availability documents
  // console.log("Meteor.user(): " + JSON.stringify(Meteor.user()));
  const userID = Meteor.userId()
  const availabilities = Availabilities.collection.find({ owner: userID }).fetch();
  console.log("availabilities: " + JSON.stringify(availabilities));
  // console.log("availabilities[0].timeSlot: " + availabilities[0].timeSlot);

  const interestsSubscription = Meteor.subscribe(Interests.userPublicationName);

  const interestsReady = interestsSubscription.ready();

  const interests = Interests.collection.find({}).fetch();

  const membershipSubscription = Meteor.subscribe(Memberships.userPublicationName);

  const membershipsReady = membershipSubscription.ready();

  const memberships = Memberships.collection.find({ userID: userID }).fetch();

  const attendeeSubscription = Meteor.subscribe(Attendees.userPublicationName);

  const attendeesReady = attendeeSubscription.ready();

  const attendees = Attendees.collection.find({}).fetch();

  const hangoutSubscription = Meteor.subscribe(Hangouts.userPublicationName);

  const hangoutsReady = hangoutSubscription.ready();

  const hangouts = Hangouts.collection.find({}).fetch();

  console.log("availabilities has: " + availabilities.length);
  return {
    availabilities,
    interestsReady,
    interests,
    memberships,
    attendees,
    attendeesReady,
    membershipsReady,
    ready,
    hangouts,
    hangoutsReady,
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(Profile);

export default withRouter(ProfileContainer);

// FUNCTIONS WIP: 
function findHangoutsParticipatedIn (theUserID) {
  console.log("In findHangoutsParticipatedIn");

//   Hangouts = name: String | description: String | dateTime: Date | groupID: Number
//   Attendees = hangoutID: Number | userID: Number

  let testing = false;
  // Find all the hangouts this user has ever participated in. Returns an array of attendee objects
  let allHangouts = Attendees.collection.find().fetch();
  console.log("allHangouts: " + JSON.stringify(allHangouts));

  // Put all of the hangout IDS from Attendee objects into an array
  let hangoutids = [];
  for (let index = 0; index < allHangouts.length; index++) {
    hangoutids.push(allHangouts[index].hangoutID);
  }
  console.log("hangoutids: " + hangoutids);
  
  // Find these hangouts using the hangoutID in the Hangouts collection in order to get more their times
  let allHangoutsInfo = Hangouts.collection.find({ "_id" : { "$in" : hangoutids } }).fetch();
  
  console.log("allHangoutsInfo: " + JSON.stringify(allHangoutsInfo));

  // Sort allHangoutsInfo by newest date to oldest date
  // allHangoutsInfo = [{"_id":"7DyQQDDWFJeeWc7z3","name":"Biscuits and tea","description":"scrumptuous","dateTime":"2021-10-20T18:00:00.000Z","groupID":"9M9pGo7D37eM3NeCj"},{"_id":"vPZGXHXzgsaBe2z2W","name":"idk","description":"idk","dateTime":"2021-10-20T18:00:00.000Z","groupID":"9M9pGo7D37eM3NeCj"}]

  return allHangoutsInfo;

  if (testing) {
        
        allHangouts.forEach(hangout => {
          // Creates an array of hangout objects
          allHangoutsInfo = allHangoutsInfo.concat(Hangouts.collection.findOne({ _id : hangout.hangoutID }).fetch());
      });

      // Sort allHangoutsInfo by newest date to oldest date
      // https://github.com/75lb/sort-array
      // https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
   
      // return allHangoutsInfo
  }
}

function findAttendees (theHangoutID) {
  console.log("in findAttendees");
  // returns an array of attendee objects
  let allAttendees = Attendees.collection.find({ hangoutID : theHangoutID}).fetch();

  let result = [];
  // Put the id of person who partook in the hangout into result array
  allAttendees.forEach(person => {
      result = result.concat(person.userID);
  });
  console.log("result:" + JSON.stringify(result));
  return result;
}

// May not need to call findHangoutsParticipatedIn if this was already done before and was saved
function findContactedPeople(theUserID) {
  console.log("In findContactedPeople");
  // Call findHangoutsParticipatedIn() to get the list of hangouts from newest date to oldest
  let hangouts = findHangoutsParticipatedIn(theUserID) // an array of hangout objects
  console.log("hangouts:" + JSON.stringify(hangouts));
  // ONly keep the hangouts that have a date older at least within 2 weeks from today
  let twoWeeksAgo = new Date(Date.now() - 12096e5);
  console.log("MONTH twoWeeksAgo: " + String(twoWeeksAgo.getMonth() + 1).padStart(2, '0'));
  console.log("DAY twoWeeksAgo: " + String(twoWeeksAgo.getDate()).padStart(2, '0'));

  let withinTwoWeeks = [];
  for (let index = 0; index < hangouts.length; index++) {
    console.log(JSON.stringify(hangouts[index].dateTime));
    if (twoWeeksAgo < hangouts[index].dateTime) {
      console.log("Found a date that is within 2 weeks");
      withinTwoWeeks.push(hangouts[index]._id);
    }
  }
  console.log("hangouts within 2 weeks:" + withinTwoWeeks);

  let contactedIds = [];
  for (let index = 0; index < withinTwoWeeks.length; index++) {
    contactedIds = contactedIds.concat(findAttendees(withinTwoWeeks[index]));
  }
  // contactedIds = _.uniq(contactedIds);
  console.log("contactedIds: " + JSON.stringify(contactedIds));
  let contacts = Availabilities.collection.find({ "owner" : {"$in" : contactedIds} }).fetch();
  console.log("contacts: " + JSON.stringify(contacts));

  let names = [];
  for (let index = 0; index < contacts.length; index++) {
    names.push(contacts[index].ownername);
  } 
  console.log("names: " + JSON.stringify(names));

  // let contacted = Attendees.collection.find({"hangoutID" : { "$in" : withinTwoWeeks}}).fetch();
  // // Consolidate duplicates and remove self
  // let contactedids = [];
  // for (let index = 0; index < contacted.length; index++) {
  //   contactedids.push(contacted[index].userId)
  // }
  // console.log("contactedids: " + contactedids);
  // contactedids = _.uniq(contactedids);
  // console.log("contactedids: " + contactedids);
  // // contactedids = contactedids.delete(theUserID);
  // // Get the names of each UserID using Availabilities collection
  // let namesObject = Availabilities.collection.find({ "owner" : {"$in" : contactedids}}).fetch();
  // console.log("namesObject: " + JSON.stringify(namesObject));
  // let names = []
  // for (let index = 0; index < namesObject.length; index++) {
  //   names.push(namesObject.ownername);
  // }
  // console.log("names: " + JSON.stringify(names));
  // return names;
  return ["harry", "Bob"];
}

function getPartsOfDate (aTimeSlot) {
  // console.log(typeof(aTimeSlot));
  aTimeSlot = aTimeSlot.split(" ");
  // returns month as a string, day as an integer, year as an integer
  // https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=1
  return [aTimeSlot[1], parseInt(aTimeSlot[2]), parseInt(aTimeSlot[3])];
}

function toWrittenMonth (aNumber) {
try {
  aNumber = parseInt(aNumber);
} catch (error) {
  throw error;
}
// May switch so that it's given a month string and then it returns a number
console.log("aNumber being passed to toWrittenMonth: " + aNumber);
switch (aNumber) {
  case 1:
    return "Jan";
  case 2:
    return "Feb";
  case 3:
    return "Mar";
  case 4:
    return "Apr";
  case 5:
    return "May";
  case 6:
    return "Jun";
  case 7:
    return "Jul";
  case 8:
    return "Aug";
  case 9:
    return "Sep";
  case 10:
    return "Oct";
  case 11:
    return "Nov";
  case 12:
    return "Dec";
  default:
    console.log("Isn't a month");
    return "UNKNOWN MONTH";
}
}

import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid, Loader, Icon, Image, Segment, Button, Form, Header, SearchResults, Container, Table } from 'semantic-ui-react';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Memberships } from '../../api/membership/Membership';
import { Groups } from '../../api/group/Group';
import { Hangouts } from '../../api/hangout/Hangout';
import { Attendees } from '../../api/attendee/Attendee';
import { Availabilities } from '../../api/availability/Availability';
import 'react-calendar/dist/Calendar.css';
import EventModal from '../components/EventModal';
import HangoutItem from '../components/HangoutItem';

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.closeModal.bind(this);
    this.state = {
      availabilityList: [],
      user: this.props.currentUser,
      selectedDate: moment(),
      isOpen: false,
      schedule: [new Date('2021-10-21T00:00:00.000Z'), new Date('Sun Oct 17 2021 17:00:00 GMT-1000 (Hawaii-Aleutian Standard Time)'), new Date('October 18, 2021 12:30:00')],
    };
  }

    closeModal = () => {
      this.setState({ isOpen: false });
    }

    objectReformat(inputArray) {
      // declare resulting array
      const result = [];

      // access "timeSlots" of this.props.availabilities
      const timeSlotObject = inputArray[0];
      // find length of timeSlots array
      const timeSlotArray = timeSlotObject[Object.keys(timeSlotObject)[2]];
      // iterate through timeSlots
      for (let i = 0; i < timeSlotArray.length; i++) {
        // push each entry to resulting array
        result.push(timeSlotArray[i]);
      }
      return result;
    }

  handleChange = newSchedule => {
    this.setState({ schedule: newSchedule }, function () {
      console.log(this.state.schedule);
    });
    console.log('hi there was a change');
    const newAvails = this.state.schedule.toString().split(',');
    console.log(`newAvails is type of: ${typeof (newAvails)}`);
    console.log(`Meteor.user()._id is: ${Meteor.user()._id}`);
    console.log(`Meteor.user()._id is type of: ${typeof (Meteor.user()._id)}`);
    const user = Meteor.user()._id;
    Meteor.call('availabilities.insert', user, newAvails);
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready && this.props.groupsReady && this.props.hangoutsReady && this.props.attendeesReady) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  formatDate(date) {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return [year, month, day].join('-');
  }

  addDays(date, days) {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }

  getField(group, key, theGroupID) { // group is an array of objects
    let result = '';
    let groupKey = 0;
    groupKey = group.findIndex(item => item._id === theGroupID);
    let groupObject = group[groupKey];
    // ^ need to add a third parameter to locate which object we need
    result = Object.values(groupObject)[key]; // returns all values from objects in an array
    // and selects the keyth index from the array
    return result;
  }

onSelect=(e) => {
  this.setState({ selectedDate: e });
}

getDates() {
  return Object.keys(this.getCountsMeteor(this.getField(this.props.groups, 0, this.props.theGroupPageID)));
}

findallMembers(theGroupID) {
 const result = [];
 const username = [];
  const members = Memberships.collection.find({ groupID: this.props.theGroupPageID }).fetch();
  const names = members.map(a => a.userID);
  // console.log(`WAWWW${JSON.stringify(names)}`);

  for (let i = 0; i < names.length; i++) {
     result.push(Meteor.users.find({ _id: names[i] }).fetch());
  }

  for (let i = 0; i < result.length; i++) {
    const groupObject = result[0][i];
    const groupArray = Object.values(groupObject)[2];
     username.push(groupArray);
   }
  return username;

  // Can't access other people's availabilities... maybe add another field into memberships collection to have a name

}

// mode defaults to false in which case the function returns user names, if set to
// true, the function returns user id
findPossibleAttendees(theTimeSlot, theGroupID, mode = false) {
  // console.log('In findPossibleAttendees in group.jsx line 122');
  /*
    if (!this.userId) {
        throw new Meteor.Error('Not authorized.');
    }
  */
  // const testing = false;

  // Manually adding another member to this group
  // Memberships.collection.insert({ userID : 'manmade2', groupID : theGroupID})

  /*
    console.log(`theTimeSlot before converting from moment date: ${theTimeSlot}`);
    theTimeSlot = moment(theTimeSlot).toISOString();
    console.log(`theTimeSlot after converting from moment date: ${theTimeSlot}`);
    */
  // Find all members in this group
  console.log(`the date passed in: ${theTimeSlot}`);
  const members = Memberships.collection.find({ groupID: theGroupID }).fetch();
  console.log(`members is: ${members}`);
  console.log(`members stringified: ${JSON.stringify(members)}`);
  // console.log("inside membeers: " + members[0].userID);

  let ids = [];
  let names = [];
  // For each member in this group, find the ones who have an availability of the given time slot
  for (let index = 0; index < members.length; index++) {
    console.log('Looking for members');
    console.log(members[index].userID);
    const memberInfo = Availabilities.collection.findOne({ owner: members[index].userID }); // PROBLEM: Can't access availabilites of other people. need to change availabilites subpub
    console.log(JSON.stringify(memberInfo));
    console.log(`One member so memberInfo: ${JSON.stringify(memberInfo)}`);
    theTimeSlot = new Date(theTimeSlot);
    console.log(`member username: ${memberInfo.ownername}`);
    if (memberInfo !== undefined && !!memberInfo.timeSlots.find(item => item.getTime() == theTimeSlot.getTime())) {
      console.log(`member has an availability and matches for theTimeSlot of: ${JSON.stringify(theTimeSlot)}`);
      ids = ids.concat(memberInfo.owner);
      names = names.concat(memberInfo.ownername);
    }
  }
  console.log(`ids: ${JSON.stringify(ids)}`);
  console.log(`names: ${JSON.stringify(names)}`);
  // Returns two arrays (NOTE: I REMOVED IDS BC REACT CANT OBJECT CHILD)
  if (mode) {
    return ids;
  }
  return names;
  return ['cat', 'dog'];
}

isInArray(array, value) {
  console.log('jashdgfjkhk');
  return !!array.find(item => item.getTime() == value.getTime());
}

getCountsMeteor(theGroupid) {
  console.log('in getCounts from code in group.jsx line 160');

  // Find all members of the group using the memberships table
  const members = Memberships.collection.find({ groupID: theGroupid }).fetch();
  console.log(members);
  // members.push({_id: 'aTtKce8kdbxYRQRqb', userID: 'kPtyujGvBW8ftdff3', groupID: 'qLv8PqH4PWdYpuTrL'}) // test member
  // console.log(members[0]);
  // console.log(members[1]);

  // Combine all of the members' availabilities into an array
  let allMemberAvails = [];
  for (let index = 0; index < members.length; index++) {
    const oneMember = Availabilities.collection.findOne({ owner: members[index].userID });
    if (oneMember !== undefined) {
      console.log('Has availabilities');
      // console.log("oneMember.timeSlots: " + oneMember.timeSlots);
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
  console.log(`countts${JSON.stringify(counts)}`);

  return counts;
}

displayAvailability(date) {
  const result = [];
  const listofAvailabilities = this.getCountsMeteor(this.getField(this.props.groups, 0, this.props.theGroupPageID));

  const newList = Object.keys(listofAvailabilities);

  for (let i = 0; i < newList.length; i++) {

    if (moment(date).format('MMM DD, YYYY') === moment(newList[i]).format('MMM DD, YYYY')) {
      result.push(newList[i]);
    }
  }
  console.log(`MEEMAW${result}`);

  return result;
}

calculateAvailability(date) {
  const result = this.getCountsMeteor(this.getField(this.props.groups, 0, this.props.theGroupPageID));
  const keys = Object.keys(result);
  for (let i = 0; i < keys.length; i++) {
    const formatKey = moment(keys[i]).format('DD MM, YYYY');
    const formatDate = moment(date).format('DD MM, YYYY');
    if (formatDate === formatKey) {
      return Object.values(result)[i];
    }
  }
}

openModal() {
  this.setState({ isOpen: true });
}

getRemainingDays(date) {
  const now = new Date();
  const result = [];
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();

  const remainingDays = totalDays - today;
  for (let i = 0; i < remainingDays + 1; i++) {
    result.push(this.addDays(today, 7 + i));
  }

  return result;
}

renderPage() {
  const date = new Date().toLocaleString;
  const mark = this.getDates();

  console.log(`MEEMAW1${this.state.selectedDate}`);
  const disabledDate = this.getRemainingDays(date);
  const newDate = new Date();
  return (
    <div className='wrapping'>
      <Grid.Column className="profile-wrapper" centered style={{ position: 'relative', display: 'flex' }}>

        <Image className='watermark' centered size='medium' src="/images/background.png"/>

      <Header as='h1' className="title" centered>{this.getField(this.props.groups, 1, this.props.theGroupPageID)} </Header>
</Grid.Column>
      <Grid columns={2} relaxed padded className="content">
        <Grid.Row stretched>
          <Grid.Column className="box" width={12}>
            <Header as='h2'>Availabilities</Header>
            <Calendar
              calendarType="ISO 8601"
              onClickDay={(value) => { console.log(this.setState({ listAvail: this.displayAvailability(value) })); this.setState({ isOpen: true }); this.setState({ selectedDate: value }); }}
              maxDate={new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0)}
              minDate={new Date(newDate.getFullYear(), newDate.getMonth(), 1)}
              tileDisabled={({ date, view }) => (view === 'month') &&
                    disabledDate.some(disabledDate => date.getFullYear() === disabledDate.getFullYear() &&
                      date.getMonth() === disabledDate.getMonth() &&
                      date.getDate() === disabledDate.getDate())}
              tileClassName={({ date }) => {
                if (mark.find(x => moment(x).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD') && this.calculateAvailability(date) == 1)) {
                  return 'low-avail';
                } if (mark.find(x => moment(x).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD') && this.calculateAvailability(date) > 1 && this.calculateAvailability(date) <= 3)) {
                  return 'med-avail';
                } if (mark.find(x => x === moment(x).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD') && this.calculateAvailability(date) > 4 && this.calculateAvailability(date) <= 5)) {
                  return 'med-avail';
                } if (mark.find(x => x === moment(x).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD') && this.calculateAvailability(date) > 5)) {
                  return 'superlarge-avail';
                }
              }} />
            <EventModal listAvail={this.displayAvailability(this.state.selectedDate)}displayDate={this.state.selectedDate} open={this.state.isOpen} closeModal={this.closeModal} findPossibleAttendees={this.findPossibleAttendees} groupID={this.getField(this.props.groups, 0, this.props.theGroupPageID)}/>
          </Grid.Column>
          <Grid.Column className="box-color" width={3}>
            <Button as={Link} to='/profile' floated='right' icon color='blue' labelPosition='right'>
      Back to Profile
              <Icon name='right arrow' />
            </Button>
            <Header as='h2'>Members</Header>
            {this.findallMembers(this.getField(this.props.groups, 0, this.props.theGroupPageID)).toString()}
            <br /><br /><br />
                    Invite more members with your unique group code: <b>{this.getField(this.props.groups, 0, this.props.theGroupPageID)}</b>
            <Header as='h2'>Rules</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column className="box-color" width={12}>
            <Header as='h2'>Scheduled Hangouts</Header>
            <Container>
              {/* {this.props.hangouts.length === 0 && */}
              {/* <Header as='h5'>It seems there are no hangouts for this group! You can create one by clicking on one of the green dates above!</Header> */}
              {/* } */}
              {/* {this.props.hangouts.length !== 0 && */}
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.props.hangouts.map((hangout) => <HangoutItem key={hangout._id} hangout={hangout} />)}
                </Table.Body>
              </Table>
            </Container>

          </Grid.Column>
          <Grid.Column className="box-color" width={12}>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
}

Group.propTypes = {
  currentUser: PropTypes.string,
  availabilities: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  groupsReady: PropTypes.bool.isRequired,
  hangoutsReady: PropTypes.bool.isRequired,
  hangouts: PropTypes.array.isRequired,
  attendeesReady: PropTypes.bool.isRequired,
  attendees: PropTypes.array.isRequired,
  theGroupPageID: PropTypes.string.isRequired,
};

const GroupContainer = withTracker((match) => {

  let url = window.location.toString().split("/");
  let theGroupPageID = url[url.length - 1];

  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Availabilities.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Availability documents
  const availabilities = Availabilities.collection.find({}).fetch();

  const groupsSubscription = Meteor.subscribe(Groups.userPublicationName);

  const groupsReady = groupsSubscription.ready();

  const groups = Groups.collection.find({}).fetch();

  const hangoutsSubscription = Meteor.subscribe(Hangouts.userPublicationName);

  const hangoutsReady = hangoutsSubscription.ready();

  const hangouts = Hangouts.collection.find({}).fetch();

  const attendeesSubscription = Meteor.subscribe(Attendees.userPublicationName);
  // attendees for testing, probably not needed
  const attendeesReady = attendeesSubscription.ready();

  const attendees = Attendees.collection.find({}).fetch();

  return {
    theGroupPageID,
    availabilities,
    ready,
    groupsReady,
    groups,
    hangoutsReady,
    hangouts,
    attendeesReady,
    attendees,
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(Group);

export default withRouter(GroupContainer);

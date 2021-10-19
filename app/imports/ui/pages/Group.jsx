import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid, Loader, Segment, Button, Form, Header } from 'semantic-ui-react';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import { withRouter} from 'react-router-dom';
import { Memberships } from '../../api/membership/Membership';
import { Groups } from '../../api/group/Group';
import { withTracker } from 'meteor/react-meteor-data';
import { Availabilities } from '../../api/availability/Availability';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import EventModal from '../components/EventModal';


class Group extends React.Component {
  constructor(props) {
      super(props);
      this.closeModal.bind(this);
      this.state =  {
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
      let result = [];
      
      // access "timeSlots" of this.props.availabilities
      let timeSlotObject = inputArray[0];
      // find length of timeSlots array
      let timeSlotArray = timeSlotObject[Object.keys(timeSlotObject)[2]];
      // iterate through timeSlots
      for (var i = 0; i < timeSlotArray.length; i++) {
        // push each entry to resulting array
        result.push(timeSlotArray[i]); 
      }
      return result;
    }   
  
  handleChange = newSchedule => {
    this.setState({ schedule: newSchedule }, function () {
        console.log(this.state.schedule);
    });
    console.log("hi there was a change");
    let newAvails = this.state.schedule.toString().split(",");
    console.log("newAvails is type of: " + typeof(newAvails));
    console.log("Meteor.user()._id is: " + Meteor.user()._id);
    console.log("Meteor.user()._id is type of: " + typeof(Meteor.user()._id));
    let user = Meteor.user()._id;
    Meteor.call('availabilities.insert', user, newAvails);
  }
   // If the subscription(s) have been received, render the page, otherwise show a loading icon.
   render() {
    return (this.props.ready && this.props.groupsReady) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

addDays(date, days) {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}

getField(group, key) {
  let result= "";
  let groupObject = group[0];
  let groupArray = Object.values(groupObject);
  result = groupArray[key];
  return result;

  // iterate through timeSlots
}   

onSelect=(e)=>{
  this.setState({selectedDate:e})
 }

getDates() {
  return Object.keys(this.getCountsMeteor(this.getField(this.props.groups, 0)));
 }

 findPossibleAttendees(theTimeSlot, theGroupID) {
  console.log("In findPossibleAttendees");
  /*
  if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
  }
*/
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
}

getCountsMeteor(theGroupid) {
  console.log("in getCounts");

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
}

// need to return a int of availablity
calculateAvailability(date) {
  let result = this.getCountsMeteor(this.getField(this.props.groups, 0));
  let keys = Object.keys(result);
  console.log("tis the date:" + date);
  console.log(keys);
  for (let i = 0; i < keys.length; i++) {
    let formatKey = moment(keys[i]).format('DD MM, YYYY');
    let formatDate = moment(date).format('DD MM, YYYY');
    if(formatDate === formatKey) {
      console.log(Object.values(result)[i]);
      return Object.values(result)[i];
    }
  }
}

getRemainingDays(date) {
  let now = new Date();
  let result = [];
  const totalDays = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const today = now.getDate();

  const remainingDays = totalDays - today;
  for (let i =0; i < remainingDays + 1; i++) {
    result.push(this.addDays(today, 7 + i));
  }
  
   return result;
}


 renderPage() {
   let date = new Date().toLocaleString;
   let mark = this.getDates();

   let today = new Date();
   console.log("hu;;p" + JSON.stringify(this.findPossibleAttendees(today, this.getField(this.props.groups, 1))));

   // console.log(this.formatDate(this.addDays(date, 6)));
   const disabledDate = this.getRemainingDays(date);
    var newDate = new Date();
    return (
      <div className='wrapping'>
         <Header as='h1' className="title">{this.getField(this.props.groups, 1)} </Header>
        <Grid columns={2} relaxed padded className="content">
            <Grid.Row stretched>
                <Grid.Column className="box" width={12}>
                <Header as='h2'>Availabilities</Header>
                 <EventModal displayDate={this.state.selectedDate} open={this.state.isOpen} closeModal={this.closeModal}/>
                    <Calendar 
                    calendarType="ISO 8601"
                    onClickDay={() => this.setState({isOpen: true})}
                    maxDate={new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0)}
                    minDate={new Date(newDate.getFullYear(), newDate.getMonth(), 1)}
                    tileDisabled={({date, view}) =>
                    (view === 'month') && // Block day tiles only
                    disabledDate.some(disabledDate =>
                      date.getFullYear() === disabledDate.getFullYear() &&
                      date.getMonth() === disabledDate.getMonth() &&
                      date.getDate() === disabledDate.getDate()
                    )}
                    defaultValue={new Date(2021, 9, 18)}
                    onSelect={this.onSelect}
                    tileClassName={({ date }) => {
                        if(mark.find(x=>moment(x).format('YYYY-MM-DD')===moment(date).format('YYYY-MM-DD') && this.calculateAvailability(date) == 1) ){
                         return 'low-avail'
                        } else if (mark.find(x=>moment(x).format('YYYY-MM-DD')===moment(date).format('YYYY-MM-DD') && this.calculateAvailability(date) > 1 && this.calculateAvailability(date) <= 3) ){
                          return 'med-avail'
                      } else if (mark.find(x=>x===moment(x).format('YYYY-MM-DD')===moment(date).format('YYYY-MM-DD') && this.calculateAvailability(date) > 4 && this.calculateAvailability(date) <= 5) ){
                        return 'med-avail'
                    } else if (mark.find(x=>x===moment(x).format('YYYY-MM-DD')===moment(date).format('YYYY-MM-DD') && this.calculateAvailability(date) > 5)) {
                      return 'superlarge-avail'
                    }}} />
                </Grid.Column>
                <Grid.Column className="box-color" width={3}>
                    <Header as='h2'>Members</Header>
                    <Header as='h2'>Rules</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
                <Grid.Column className="box-color" width={12}>
                  <Header as='h2'>Hangouts</Header>
                </Grid.Column>
                <Grid.Column className="box-color" width={12}>
                </Grid.Column>
            </Grid.Row>
        </Grid>
      </div>
    )
  }
}

Group.propTypes = {
  currentUser: PropTypes.string,
  availabilities: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  groupsReady: PropTypes.bool.isRequired,
};

 const GroupContainer = withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Availabilities.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Availability documents
  const availabilities = Availabilities.collection.find({}).fetch();
  
  const groupsSubscription = Meteor.subscribe(Groups.userPublicationName);

  const groupsReady = groupsSubscription.ready();

  const groups = Groups.collection.find({}).fetch();

  return {
    availabilities,
    ready,
    groupsReady,
    groups,
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(Group);

export default withRouter(GroupContainer);

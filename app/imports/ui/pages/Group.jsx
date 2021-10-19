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

class Group extends React.Component {
  constructor(props) {
      super(props);
      this.state =  {
        user: this.props.currentUser,
        schedule: [new Date('2021-10-21T00:00:00.000Z'), new Date('Sun Oct 17 2021 17:00:00 GMT-1000 (Hawaii-Aleutian Standard Time)'), new Date('October 18, 2021 12:30:00')],
      };
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
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

 renderPage() {
   var date = Date().toLocaleString();

    const mark = [
      this.formatDate(this.addDays(date, 7)),
     
    ]
    console.log(this.formatDate(this.addDays(date, 6)));
    const disabledDate = [
      new Date(2021, 10, 18),
      new Date(2021, 10, 10),
    ];

    console.log("the group id is = " + JSON.stringify(this.props.groups._id));

    var newDate = new Date();

    let allAvailabilities = Meteor.call('availabilities.getCounts', this.props.groups._id);
    console.log("availabilities = " + allAvailabilities);
    return (
      <div className='wrapping'>
         <Header as='h1' className="title">{this.props.groups.name} </Header>
        <Grid columns={2} relaxed padded className="content">
            <Grid.Row stretched>
                <Grid.Column className="box" width={12}>
                <Header as='h2'>Availabilities</Header>
                    <Calendar 
                    calendarType="ISO 8601"
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
                    tileClassName={({ date, view }) => {
                        if(mark.find(x=>x===moment(date).format('YYYY-MM-DD'))){
                         return 'highlight'
                        }
                      }}
                  
                    />
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

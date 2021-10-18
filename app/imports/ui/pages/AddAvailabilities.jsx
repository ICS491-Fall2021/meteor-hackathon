import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid, Segment, Button, Form, Header } from 'semantic-ui-react';
import ScheduleSelector from 'react-schedule-selector';
import { withTracker } from 'meteor/react-meteor-data';
import { Availabilities } from '../../api/availability/Availability';

class AddAvailabilities extends React.Component {
  constructor(props) {
      super(props);
      this.state =  {
        user: this.props.currentUser,
      };      
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
  render() {

    return (
      <ScheduleSelector
                    selection={this.state.schedule}
                    numDays={7}
                    minTime={8}
                    dateFormat='ddd'
                    timeFormat='h:mm a'
                    maxTime={22}
                    hourlyChunks={2}
                    onChange={this.handleChange}
                    selection={this.state.schedule}
                />

    )
  }
}

export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Availabilities.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Availability documents
  const availabilities = Availabilities.collection.find({}).fetch();
  return {
    availabilities,
    ready,
  };
})(AddAvailabilities);
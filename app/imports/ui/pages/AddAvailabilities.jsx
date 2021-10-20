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
    let user = Meteor.user()._id;
    let username = Meteor.user().username;
    Meteor.call('availabilities.insert', user, username, this.state.schedule);
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
                    hourlyChunks={1}
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
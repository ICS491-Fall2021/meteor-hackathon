import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid, Loader, Segment, Button, Form, Header, Menu } from 'semantic-ui-react';
import ScheduleSelector from 'react-schedule-selector'
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Memberships } from '../../api/membership/Membership';
import { Groups } from '../../api/group/Group';
import { withTracker } from 'meteor/react-meteor-data';
import { Availabilities } from '../../api/availability/Availability';

class Profile extends React.Component {
  constructor(props) {
    console.log("--In constructor--");
      super(props);
      this.state =  {
        user: this.props.currentUser,
      };
    }

   objectReformat(inputArray) {
      console.log("--In objectReformat--");
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
    console.log("state.schedule type is: " + typeof(this.state.schedule));
    let newAvails = this.state.schedule.toString().split(",");
    console.log("newAvails is type of: " + typeof(newAvails));
    console.log("Meteor.user()._id is: " + Meteor.user()._id);
    console.log("Meteor.user()._id is type of: " + typeof(Meteor.user()._id));
    let user = Meteor.user()._id;
    Meteor.call('availabilities.insert', user, newAvails);
  }
   // If the subscription(s) have been received, render the page, otherwise show a loading icon.
   render() {
    console.log("--In render?--");
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    console.log("--In renderPage--");
    console.log("this.props.availabilities length: " + this.props.availabilities.length);
    if (this.props.availabilities.length > 0) {
      console.log("has an item");
      console.log("Stringified version is: " + JSON.stringify(this.props.availabilities));
      this.state.schedule = this.objectReformat(this.props.availabilities);
      console.log("this.state.schedule after objectReformat" + this.state.schedule);
    }
    return (
      <div className='wrapping'>
         <Header as='h1' className="title">{this.props.currentUser}</Header>
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
                      hourlyChunks={2}
                      onChange={this.handleChange}
                      selection={this.state.schedule}
                  />
                  <Menu.Item as={NavLink} activeClassName="active" exact to="/availability" key='availability'>
                            <Button>Add a new availability!</Button>
                        </Menu.Item>
                </Grid.Column>
                <Grid.Column className="box-color" width={3}>
                    <Header as='h2'>Groups</Header>
                    
                    <Header as='h2'>Contacted</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
                <Grid.Column className="box-color" width={12}>
                  <Header as='h2'>Interests</Header>
                    <Form>
                      <Form.Group grouped>
                        <label>Add your Interests</label>
                        <Form.Field label='This one' control='input' type='checkbox' />
                        <Form.Field label='That one' control='input' type='checkbox' />
                      </Form.Group>
                      <Form.Group widths='equal'>
                        <Form.Field label='Input your interest' control='input' />
                      </Form.Group>
                      <Form.Field control='button'>
                        Submit
                      </Form.Field>
                  </Form>
                </Grid.Column>
                <Grid.Column className="box-color" width={12}>
                </Grid.Column>
            </Grid.Row>
        </Grid>
      </div>
    )
  }
}

Profile.propTypes = {
  currentUser: PropTypes.string,
  availabilities: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

 const ProfileContainer = withTracker(() => {
   console.log("--In withtracker--");
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Availabilities.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Availability documents
  const availabilities = Availabilities.collection.find({}).fetch();
  console.log("availabilities has: " + availabilities.length);
  return {
    availabilities,
    ready,
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(Profile);

export default withRouter(ProfileContainer);

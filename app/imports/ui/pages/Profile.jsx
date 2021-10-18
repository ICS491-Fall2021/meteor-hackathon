import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid, Loader, Segment, Button, Form, Header, Menu } from 'semantic-ui-react';
import ScheduleSelector from 'react-schedule-selector'
import PropTypes from 'prop-types';
import { withRouter, NavLink} from 'react-router-dom';
import { AutoForm, ErrorsField, TextField, SubmitField } from 'uniforms-semantic';
import { Roles } from 'meteor/alanning:roles';
import { Memberships } from '../../api/membership/Membership';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Groups } from '../../api/group/Group';
import { withTracker } from 'meteor/react-meteor-data';
import { Availabilities } from '../../api/availability/Availability';
import { Interests } from '../../api/interests/Interests';
import InterestItem from '../components/InterestItem';

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
    console.log("newAvails is type of: " + typeof(newAvails));
    console.log("Meteor.user()._id is: " + Meteor.user()._id);
    console.log("Meteor.user()._id is type of: " + typeof(Meteor.user()._id));
    let user = Meteor.user()._id;
    Meteor.call('availabilities.insert', user, newAvails);
  }

   // If the subscription(s) have been received, render the page, otherwise show a loading icon.
   render() {
    console.log("--In render?--");
    return (this.props.ready && this.props) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    let fRef = null;
    console.log("--In renderPage--");
    if (this.props.availabilities.length > 0) {
      this.state.schedule = this.objectReformat(this.props.availabilities);
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

Profile.propTypes = {
  currentUser: PropTypes.string,
  availabilities: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
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
  
  const interestsSubscription = Meteor.subscribe(Interests.userPublicationName);

  const interestsReady = interestsSubscription.ready();

  const interests = Interests.collection.find({}).fetch();

  console.log("availabilities has: " + availabilities.length);
  return {
    availabilities,
    interestsReady,
    interests,
    ready,
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(Profile);

export default withRouter(ProfileContainer);

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
    return (this.props.ready && this.props.interestsReady && this.props.membershipsReady) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    let fRef = null;
    console.log("--In renderPage--");
    if (this.props.availabilities.length > 0) {
      this.state.schedule = this.objectReformat(this.props.availabilities);
    }
 
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
                    <CreateGroup open={this.state.openCreate} closeModal={this.closeModal}/>
                    <JoinGroup open={this.state.openJoin} closeModal={this.closeModal}/>
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
  const availabilities = Availabilities.collection.find({ owner : userID }).fetch();
  console.log("availabilities: " + JSON.stringify(availabilities));
  // console.log("availabilities[0].timeSlot: " + availabilities[0].timeSlot);

  const interestsSubscription = Meteor.subscribe(Interests.userPublicationName);

  const interestsReady = interestsSubscription.ready();

  const interests = Interests.collection.find({}).fetch();

  const membershipSubscription = Meteor.subscribe(Memberships.userPublicationName);

  const membershipsReady = membershipSubscription.ready();

  const memberships = Memberships.collection.find({}).fetch();
  console.log("availabilities has: " + availabilities.length);
  return {
    availabilities,
    interestsReady,
    interests,
    memberships,
    membershipsReady,
    ready,
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(Profile);

export default withRouter(ProfileContainer);

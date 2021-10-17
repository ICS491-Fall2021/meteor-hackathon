import React from 'react';
import { Grid, Segment, Button, Form, Header } from 'semantic-ui-react';
import ScheduleSelector from 'react-schedule-selector'
import { Availabilities } from '../../api/availability/Availability';


class Profile extends React.Component {
  constructor(props) {
      super(props);
      this.state =  {
        user: this.props.currentUser,
        schedule: [new Date('Sun Oct 17 2021 13:30:00 GMT-1000 (Hawaii-Aleutian Standard Time)'), new Date('October 18, 2021 12:30:00')],
      };
    }

  handleChange = newSchedule => {
    this.setState({ schedule: newSchedule }, function () {
        console.log(this.state.schedule);
    });
    console.log("hi there was a change");
    // console.log(typeof(this.state.schedule));
    // Add to availabilities db(this.props.currentUser, this.state.schedule);
    // theArray = this.state.schedule.theArray;
    // console.log(".theArray is type of: " + typeof(this.state.schedule.toString()));
    let newAvails = this.state.schedule.toString().split(",");
    // console.log("the array is: " + this.state.schedule.theArray);
    //console.log(theArray);
    console.log("newAvails is type of: " + typeof(newAvails));
    console.log("Meteor.user()._id is: " + Meteor.user()._id);
    console.log("Meteor.user()._id is type of: " + typeof(Meteor.user()._id));
    Availabilities.collection.insert(newAvails, Meteor.user()._id);
  }
  render() {

    return (
      <Grid columns={2} relaxed padded className="wrapping">
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

    )
  }
}

export default Profile;

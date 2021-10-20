import React from 'react';
import { Modal } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SelectField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import Moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import Group from '../pages/Group';
import { Memberships } from '../../api/membership/Membership';
import { Hangouts } from '../../api/hangout/Hangout';
import { Attendees } from '../../api/attendee/Attendee';
import { Groups } from '../../api/group/Group';
import { Availabilities } from '../../api/availability/Availability';
import { Stuffs } from '../../api/stuff/Stuff';

let warningAppeared = false;

/** Renders a modal for creating a group in the Profile page. See pages/Profile.jsx. */
class EventModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: '',
    };
  }

  handleClick = () => {
    this.props.closeModal();
  }

  render() {
    const formSchema = new SimpleSchema({
      name: String,
      description: String,
      time: { type: Date /* allowedValues: this.props.listAvail */ },
    });

    const bridge = new SimpleSchema2Bridge(formSchema);

    function createFormOptions(dates, groupID, findPossibleAttendees) {
      console.log('in CREATE FORM OPTIONS');
      return dates.map(date => {
        const attendees = findPossibleAttendees(date, groupID);
        return {
          label: `${Moment(date).format('h:mm:ss a')} with ${attendees}`,
          value: date,
        }
      });
    }

    let fRef = null;
    const userId = Meteor.user()._id;
    return (
      <Modal
        closeIcon
        open={this.props.open}
        size={'tiny'}
        onClose={this.props.closeModal}>
        <Modal.Header>Hangouts for {Moment(this.props.displayDate).format('MMM DD, YYYY')}</Modal.Header>
        <AutoForm ref={ref => { fRef = ref; }}
          schema={bridge}
          onSubmit={data => { this.submit(data, fRef); }}
          model={this.props.doc}>
          <Modal.Content>
            <Modal.Description>
              <div className='create-group-inputs'>
                <SelectField
                  name='time' placeholder='Select Availability'
                  options={createFormOptions(this.props.listAvail, this.props.groupID, this.props.findPossibleAttendees)}
                />
                <TextField name='name'/>
                <LongTextField name='description'/>
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions align='right'>
            <SubmitField value='Submit'/>
          </Modal.Actions>
          <ErrorsField/>
        </AutoForm>
      </Modal>
    );
  }

  // On submit, insert the data.
  submit(data, formRef) {
    const { name, description, time } = data;
    const userId = Meteor.user()._id;
    const groupID = this.props.groupID;
    const dateTime = time;
    const attendees = this.props.findPossibleAttendees(dateTime, groupID, true);
    if (!warningAppeared && attendees.length > 10){
      swal('Too many people!', 'Your hangout will potentially break CDC guidelines if everyone available shows up, if you still want to propose it, press submit again.', 'error');
      warningAppeared = true;
    } else {
      const hangoutID = Hangouts.collection.insert({ name, description, dateTime, groupID },
        (error, _id) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Hangout created successfully', 'success');
            formRef.reset();
            warningAppeared = false;
          }
        });
      console.log(`THE ATTENDEES ARE: ${attendees}`);
      attendees.forEach(userID => Attendees.collection.insert({ hangoutID, userID }));
    }
  }
}

// Require a document to be passed to this component.
EventModal.propTypes = {
  listAvail: PropTypes.array.isRequired,
  open: PropTypes.bool,
  doc: PropTypes.object,
  closeModal: PropTypes.func,
  displayDate: PropTypes.object,
  groupID: PropTypes.string,
  findPossibleAttendees: PropTypes.func,
};

export default EventModal;

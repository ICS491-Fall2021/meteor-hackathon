import React from 'react';
import { Modal } from 'semantic-ui-react';
import { Groups } from '../../api/group/Group';
import { Hangout } from '../../api/hangout/Hangout';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Memberships } from '../../api/membership/Membership';
import Moment from 'moment';

const bridge = new SimpleSchema2Bridge(Groups.schema);

/** Renders a modal for creating a group in the Profile page. See pages/Profile.jsx. */
class EventModal extends React.Component {
  constructor(props) {
      super(props);
      this.state =  {
        groupId: '',
      };
  }

  handleClick = () => {
    this.props.closeModal();
  }
  
  
  render() {
    let fRef = null;
    const userId = Meteor.user()._id;
    return (
        <Modal
            closeIcon
            open={this.props.open}
            size={'tiny'}
            onClose={this.props.closeModal}>
          <Modal.Header>Hangouts for {Moment(this.props.displayDate).format('MMM DD, YYYY')}</Modal.Header>
          <h3> Possible Attendees: </h3>
          {this.props.members}
          <AutoForm ref={ref => { fRef = ref; }} 
                    schema={bridge} 
                    onSubmit={data => { this.submit(data, fRef);}} 
                    model={this.props.doc}>
            <h3> List of Availability </h3>
            {this.props.listAvail}
            <Modal.Content>
              <Modal.Description>
                <div className='create-group-inputs'>
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
    const { name, description, dateTime, groupID, _id } = data;
    const userId = Meteor.user()._id;
    let groupId = Hangout.collection.insert({ name, description, dateTime, groupID, _id },
      (error, _id) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Hangout created successfully', 'success');
          formRef.reset();
        }
      });
  }
}

export default EventModal;
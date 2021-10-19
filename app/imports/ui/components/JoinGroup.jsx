import React from 'react';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { AutoForm, TextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Link } from 'react-router-dom';
import { Memberships } from '../../api/membership/Membership';

const bridge = new SimpleSchema2Bridge(Memberships.schema);


export class JoinGroup extends React.Component {

  handleClick = () => {
    this.props.closeModal();
  }
  

  /** Renders a modal for joining a group in the Profile page. See pages/Profile.jsx. */
  render() {
    let fRef = null;
    let open = this.props.open;
    return (
      <AutoForm 
        ref={ref => { fRef = ref; }} 
        schema={bridge} 
        onSubmit={console.log}
        model={this.props.doc}>
        <Modal
            open={open}
            size={'tiny'}
            onClose={this.props.closeModal}
            >
          <Modal.Header>Join a Group</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <TextField name='groupID' className='join-group-inputs'/>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <SubmitField value='Submit' />
            <Link to={`/group/${this.props.groupID}`} /> {/* need ta check if still wokrs*/}
          </Modal.Actions>
        </Modal>
        <ErrorsField />
      </AutoForm>
    );
  }

  // Function to handle group joins [in progress]
  submit(data, formRef) {
    const { groupID } = data;
    const userID = Meteor.user()._id;

    Memberships.collection.insert({ userID, groupID, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Record created successfully', 'success');
          formRef.reset();
        }
      });
    console.log("success!");
  }
}

export default JoinGroup;

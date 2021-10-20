import React from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react';
import { Groups } from '../../api/group/Group';
import { AutoForm, TextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

const bridge = new SimpleSchema2Bridge(Groups.schema);

/** Renders a modal for creating a group in the Profile page. See pages/Profile.jsx. */
class CreateGroup extends React.Component {
  render() {
    let fRef = null;
    return (
        <Modal
            open={this.props.open}
            size={'tiny'}
            onClose={this.props.closeModal}>
          <Modal.Header>Create a Group</Modal.Header>
          <AutoForm ref={ref => { fRef = ref; }} 
                    schema={bridge} 
                    onSubmit={data => { this.submit(data, fRef);}} 
                    model={this.props.doc}>
            <Modal.Content>
              <Modal.Description>
                <div className='create-group-inputs'>
                  <TextField name='name'/>
                  <TextField name='description'/>
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
    const { name, description, _id } = data;
    const owner = Meteor.user().username;
    const userId = Meteor.user()._id;
    let groupId = Groups.collection.insert({ name, _id, description, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Group created successfully', 'success');
          formRef.reset();
        }
      });
    Meteor.call('memberships.insert', userId, groupId);
  }
}

export default CreateGroup;
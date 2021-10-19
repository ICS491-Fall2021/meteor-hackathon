import React from 'react';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { AutoForm, TextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Link } from 'react-router-dom';
import { Memberships } from '../../api/membership/Membership';


// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  groupID: {
    type: String,
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

export class JoinGroup extends React.Component {
  /** Renders a modal for joining a group in the Profile page. See pages/Profile.jsx. */
  render() {
    let fRef = null;
    let open = this.props.open;
    return (
        this.props.groupID ?
          /* WIP - this does not redirect them yet, this.props.groupID is undefined, have to replace with value of the TextField on submit. */
          <Link to={`/group/${this.props.groupID}`} />
        :
        <Modal
            open={open}
            size={'tiny'}
            onClose={this.props.closeModal}>
          <Modal.Header>Join a Group</Modal.Header>
          <AutoForm 
            ref={ref => { fRef = ref; }} 
            schema={bridge} 
            onSubmit={data => { this.submit(data, fRef);}}
            model={this.props.doc}>
          <Modal.Content>
            <Modal.Description>
              <TextField name='groupID'/>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <SubmitField value='Join' />
            <Link to={`/group/${this.props.groupID}`} />
          </Modal.Actions>
           <ErrorsField />
          </AutoForm>
        </Modal>
    );
  }

  // Function to handle group joins [in progress]
  submit(data, formRef) {
    const { groupID } = data;
    const userID = Meteor.user()._id;

    Memberships.collection.insert({ userID, groupID },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Record created successfully', 'success');
          formRef.reset();
        }
      });
  }
}

export default JoinGroup;

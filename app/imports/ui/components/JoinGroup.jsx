import React from 'react';
import { Modal } from 'semantic-ui-react';
import { Groups } from '../../api/group/Group';
import { AutoForm, TextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  groupCode: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

class JoinGroup extends React.Component {
  /** Renders a modal for joining a group in the Profile page. See pages/Profile.jsx. */
  render() {
    let fRef = null;
    return (
      <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
        <Modal
            open={this.props.open}
            size={'tiny'}>
          <Modal.Header>Join a Group</Modal.Header>
          <Modal.Content>
            <TextField name='groupCode'/>
          </Modal.Content>
          <Modal.Actions>
            <SubmitField value='Join'/>
          </Modal.Actions>
        </Modal>
        {console.log(Groups.collection.find())}
        <ErrorsField />
      </AutoForm>
    );
  }

  // Function to handle group joins [in progress]
  submit(data, formRef) {
    const { name, description } = data;
    const owner = Meteor.user().username;
  }
}

export default JoinGroup;

import React from 'react';
import { Input, Modal, Button } from 'semantic-ui-react';
import { Groups } from '../../api/group/Group';
import { AutoForm } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  groupCode: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

class JoinGroupModal extends React.Component {
  /* Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { groupCode: '', redirectToReferer: false };
  }

  /* Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** Renders a modal for joining a group in the Profile page. See pages/Profile.jsx. */
  render() {
    let fRef = null;
    return (
      <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
        <Modal
            open={true}
            size={'tiny'}>
          <Modal.Header>Join a Group</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <div>
                  <Input 
                    label='Code: ' 
                    placeholder='Enter group code'
                    onChange={this.handleChange}
                    name="groupCode"
                  />
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Join"
              labelPosition='right'
              icon='checkmark'
              onClick={this.submit}
              positive
            />
          </Modal.Actions>
        </Modal>
      </AutoForm>
    );
  }

  // Function to handle group joins [in progress]
  submit(data, formRef) {
    const { name, description } = data;
    const owner = Meteor.user().username;
    Groups.collection.insert({ name, description, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Group created successfully', 'success');
          formRef.reset();
        }
      });
  }
}

export default JoinGroupModal;

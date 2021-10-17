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
  name: String,
  description: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders a modal for creating a group in the Profile page. See pages/Profile.jsx. */
class CreateGroupModal extends React.Component {
  /* Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { name: '', description: '', redirectToReferer: false };
  }

  /* Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  render() {
    let fRef = null;
    return (
      <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
        <Modal
            open={false}
            size={'tiny'}>
          <Modal.Header>Create a Group</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <div className='name-input'>
                  <Input 
                    label='Name: ' 
                    placeholder='Enter group name'
                    onChange={this.handleChange}
                    name='name'
                    value={this.state.name}/>
              </div>
              <div>
                  <Input 
                    label='Description: ' 
                    placeholder='Enter group description'
                    onChange={this.handleChange}
                    name='description'
                    value={this.state.description}/>
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Confirm"
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

  // On submit, insert the data.
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

export default CreateGroupModal;

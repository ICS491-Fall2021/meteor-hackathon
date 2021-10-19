import React from 'react';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { Groups } from '../../api/group/Group';
import { AutoForm, TextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Link } from 'react-router-dom';
import Profile from '../pages/Profile';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  groupCode: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);



export class JoinGroup extends React.Component {

  handleClick = () => {
    this.props.closeModal();
  }
  

  /** Renders a modal for joining a group in the Profile page. See pages/Profile.jsx. */
  render() {
    let fRef = null;
    let open = this.props.open;
    return (
      <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
        <Modal
            open={open}
            size={'tiny'}
            >
          <Modal.Header>Join a Group</Modal.Header>
          <Modal.Content>
            <TextField name='groupCode'/>
          </Modal.Content>
          <Modal.Actions>
          <Button  onClick={this.handleClick}>
          <Icon name='remove' /> Exit
        </Button>
            <SubmitField value='Join' />
            <Link to={`/group/${this.props.user}`} /> {/* need ta check if still wokrs*/}
          </Modal.Actions>
        </Modal>
        <ErrorsField />
      </AutoForm>
    );
  }

  // Function to handle group joins [in progress]
  submit(data, formRef) {
    const { groupCode } = data;
    const owner = Meteor.user().username;
  }
}

export default JoinGroup;

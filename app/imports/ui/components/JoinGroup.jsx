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
  constructor(props) {
    super(props);
    this.state =  {
      joined: false,
      groupID: '',
    };
  }

  /** Renders a modal for joining a group in the Profile page. See pages/Profile.jsx. */
  render() {
    let fRef = null;
    let open = this.props.open;
    return (
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
            <TextField name='groupID' className={'join-modal'}/>
            {
            this.state.joined 
            ?
              <Button className={'button-align'}>
                <Link to={`/group/${this.state.groupID}`}>Go to your group!</Link>
              </Button>
            :
              <SubmitField value='Join' className={'button-align'}/>
            }
            <ErrorsField />
          </AutoForm>
        </Modal>
    );
  }

  // Function to handle group joins [in progress]
  submit(data, formRef) {
    const { groupID } = data;
    const userID = Meteor.user()._id;

    const exists = Memberships.collection.find({ userID, groupID }, {limit: 1}).count({});
    if (!exists) {
      Memberships.collection.insert({ userID, groupID },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Group joined successfully', 'success')
            .then((value) => {
              this.setState({
                groupID,
                joined: true,
              });
            });
            formRef.reset();
          }
        });
    } else {
      swal('Error', 'Group already joined!', 'error');
    }
  }
}

export default JoinGroup;

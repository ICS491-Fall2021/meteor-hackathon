import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, LongTextField, TextField, SelectField, SubmitField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Interests } from '../../api/interests/Interests';

const bridge = new SimpleSchema2Bridge(Interests.schema);

/** Renders the Page for editing a single document. */
class EditInterests extends React.Component {

  // On successful submit, insert the data.
  submit(data) {
    const { interests, _id } = data;
    Interests.collection.update(_id, { $set: { interests } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    let fRef = null;

    return (
      <div className="wrap">
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" style={{ color: 'white', padding: '100px 0 0 0' }} textAlign="center">Edit Interest</Header>
            <AutoForm schema={bridge} onSubmit={data => this.submit(data)} model={this.props.doc}>
                <Segment>
                  <TextField name='interests' />
                  <SubmitField value='Submit' />
                  <ErrorsField />
                </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

// Require the presence of a Status document in the props object. Uniforms adds 'model' to the props, which we use.
EditInterests.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Status documents.
  const subscription = Meteor.subscribe(Interests.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Interests.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(EditInterests);

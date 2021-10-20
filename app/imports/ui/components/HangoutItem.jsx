import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class HangoutItem extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(this.props.hangout.dateTime)}</Table.Cell>
        <Table.Cell>{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', timeZone: 'HST' }).format(this.props.hangout.dateTime)}</Table.Cell>
        <Table.Cell>{this.props.hangout.name}</Table.Cell>
        <Table.Cell>{this.props.hangout.description}</Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
HangoutItem.propTypes = {
  hangout: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    dateTime: PropTypes.instanceOf(Date),
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(HangoutItem);

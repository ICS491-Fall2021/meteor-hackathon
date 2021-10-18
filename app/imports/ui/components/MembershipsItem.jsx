import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Status table. See pages/ListStatus.jsx. */
class MembershipsItem extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.membership.groupID}</Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
MembershipsItem.propTypes = {
  membership: PropTypes.shape({
    _id: PropTypes.string,
    userID: PropTypes.string,
    groupID: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(MembershipsItem);

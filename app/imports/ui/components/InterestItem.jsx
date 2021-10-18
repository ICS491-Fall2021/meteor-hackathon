import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Status table. See pages/ListStatus.jsx. */
class InterestItem extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.interest.interests}</Table.Cell>
        <Table.Cell>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
InterestItem.propTypes = {
  interest: PropTypes.shape({
    owner: PropTypes.string,
    interest: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(InterestItem);

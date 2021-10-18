import React from 'react';
import { Table, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Groups } from '../../api/group/Group';

/** Renders a single row in the List Status table. See pages/ListStatus.jsx. */
class MembershipsItem extends React.Component {
  render() {
    let groupName = Groups.collection.find({ _id : this.props.membership.groupID}).fetch();
    return (
    <List.Item><Link to={`/group/${this.props.membership.groupID}`}>{groupName[0].name}</Link></List.Item>
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

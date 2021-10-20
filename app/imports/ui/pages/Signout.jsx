import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Icon, Header, Image } from 'semantic-ui-react';
import { Link } from "react-router-dom";

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
export default class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
      <div>
         <Image size='large' circular src="/images/Logo2transparent.png" centered />
         <Header as="h2" centered>You are signed out.</Header>
         <Button as={Link} to='/' icon color='blue' centered labelPosition='right'>
       Back to Home
       <Icon name='right arrow' />
        </Button>
        </div>
    );
  }
}

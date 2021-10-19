import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Image } from 'semantic-ui-react';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
export default class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
      <Header id="signout-page" as="h2" textAlign="center">
        <Image size='medium' circular src="/images/Logo2transparent.png" centered />
        <p>You are signed out.</p>
      </Header>
    );
  }
}

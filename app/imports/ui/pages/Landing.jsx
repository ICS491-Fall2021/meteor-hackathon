import React from 'react';
import { withRouter, NavLink} from 'react-router-dom';
import { Grid, Image, Icon, Button } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return ( 
      <Grid className='landing-page' verticalAlign='middle' textAlign='center' container>

        <Grid.Column width={5}>
          <Image size='huge' circular src="/images/Logo2transparent.png"/>
        </Grid.Column>

        <Grid.Column width={6}>
          <h1>Welcome to Proxamie</h1>
          <p>Connect with your friends now!</p>
          <Button as={NavLink} exact to="/signin" icon color='blue' labelPosition='right'>
      Login
      <Icon color='white' name='right arrow' />
       </Button>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Landing;

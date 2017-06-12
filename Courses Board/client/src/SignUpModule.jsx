import React from 'react'
import request from 'superagent';
import {Grid, Cell} from 'react-mdl';

import SignUpForm from './SignUpFormModule'

class SignUpModule extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      user: {
        name: '',
        password: ''
      }
    };

    this.changeText = this.changeText.bind(this);
    this.userSignUp = this.userSignUp.bind(this);
  }

  userSignUp(event) {
    var self = this;
    event.preventDefault();
    request
     .post('/api/signup')
     .send(this.state.user)
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (err || !res.ok) {
         console.log('Oh no! error', err);
       } else {
         self.setState({
           errors: res.body.errors
        });
      }
    });
  }

  changeText(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({
      user
    });
  }

  render() {
    return (
      <Grid>
        <Cell col={3}></Cell>
        <Cell col={6}>
          <SignUpForm
            onSubmit={this.userSignUp}
            onChange={this.changeText}
            errors={this.state.errors}
            user={this.state.user}
            />
        </Cell>
        <Cell col={3}></Cell>
      </Grid>
    );
  }
}

export default SignUpModule;

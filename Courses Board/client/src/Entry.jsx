import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import LoginModule from './LoginModule'
import SignUpModule from './SignUpModule'

class Entry extends Component {
  render() {
    return (
      <div>
        <Tabs>
          <Tab label="Sign Up" >
            <div>
              <SignUpModule />
            </div>
          </Tab>
          <Tab label="Login In" >
            <div>
              <LoginModule />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Entry;

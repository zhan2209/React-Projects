/* eslint no-unused-vars: "off" */

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Entry from './Entry'
import RootPage from './RootPage';
import CoursesDisplay from './CoursesDisplay';
import CourseDiscover from './CourseDiscover';
import Auth from './Auth';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

injectTapEventPlugin();

const canAccess = (nextState, replace) => {
  if (!Auth.isUserAuthenticated()) {
    replace({ pathname: '/' })
  }
}

render((
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Router history={browserHistory}>
      <Route path="/" component={Entry}/>
      <Route path="/main" component={RootPage} onEnter={canAccess}>
        <IndexRoute component={CoursesDisplay}/>
        <Route path="/discover" component={CourseDiscover} />
      </Route>
    </Router>
  </MuiThemeProvider>
), document.getElementById('root'))

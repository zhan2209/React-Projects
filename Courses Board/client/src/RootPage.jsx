import React from 'react'
import HeaderModule from './HeaderModule'
import Auth from './Auth'

class RootPage extends React.Component {
  render () {
    const username = Auth.getUserName();
    return (
      <div>
        <HeaderModule username={username} />
        {this.props.children}
      </div>
    );
  }
}

export default RootPage;

import React, { Component } from 'react';
import './header.css';
import AppBar from 'material-ui/AppBar';

class Header extends Component {
  render() {
    return (
    <div className='header'>
      <AppBar position="static" color="default">
        <h2 className='container' > Dasboard </h2>
      </AppBar>
    </div>
    );
  }
}

export default Header;